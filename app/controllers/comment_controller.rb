require 'erb'
class CommentController < ApplicationController
	def getComments
		@group_id=params[:group_id]
		@result=Comment.select('comments.id,commentGroup_id,comments.user_id,fbid,content,username,comments.created_at').joins(:user).where(:group_id=>@group_id).order('commentGroup_id ASC,comments.id ASC');
		@time=[]
		@result.each_with_index do |r,i|
			@time[i]=r.created_at.strftime("%m %d,%Y %H:%M:%S")
			r.content=ERB::Util.html_escape(r.content)
		end
		render :json=>[@result,@time]
	end
	
	def newEntity
		@comment=Comment.new
		@comment.user_id=params[:user_id]
		if @comment.user_id==nil || @comment.user_id!=session[:user_id]
			render :json=>false
		end
		@sender_username=session[:username]
		@comment.content=params[:content]
		@comment.group_id=params[:group_id]
		@r
		if @comment.save
			@comment.commentGroup_id=@comment.id
			@r=@comment.save
		end

		if @r
			@receiver=Group.select('groups.title,groups.trip_id,username,fbid,trips.user_id,email').joins(:user,:trip).find_by_id(@comment.group_id)
			if params[:owner_user_id].to_i != params[:user_id].to_i
				CommentMailer.notify(@receiver.trip_id,@comment.group_id,@sender_username,@receiver.title,@comment.content,@receiver).deliver
			end
			render :json=>[@comment.id,@comment.commentGroup_id,@sender_username,@comment.created_at.strftime("%m %d,%Y %H:%M:%S")]
		else
			render :json=>false
		end
	end

	def newReply
		@comment=Comment.new
		@comment.user_id=params[:user_id]
		if @comment.user_id==nil || @comment.user_id!=session[:user_id]
			render :json=>false
		end
                @sender_username=session[:username]
		@comment.content=params[:content]
		@comment.group_id=params[:group_id]
		@comment.commentGroup_id=params[:commentGroup_id]
		if @comment.save
			@receiver=Comment.select('Distinct comments.user_id,groups.title,groups.trip_id,username,fbid,email').joins(:user,:group).where(:commentGroup_id=>@comment.commentGroup_id)
			@receiver.each do |r|
				if r.user_id!=@comment.user_id
					CommentMailer.notifyreply(r.trip_id,@comment.group_id,@sender_username,r.title,@comment.content,r).deliver
				end
			end
			
			render :json=>[@comment.id,@sender_username,@comment.created_at.strftime("%m %d,%Y %H:%M:%S")]
		else
			render :json=>false
		end
	end
	
	def deleteReply
		@comment=Comment.joins(:group).find_by_id(params[:id])
		if @comment.user_id==session[:user_id] || @comment.group.user_id==session[:user_id]
			if @comment.destroy
				render :json=>true
			else
				render :json=>false
			end
		else
			render :json=>false
		end
	end
end
