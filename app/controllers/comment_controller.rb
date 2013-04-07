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
		@comment.content=params[:content]
		@comment.group_id=params[:group_id]
		@r
		if @comment.save
			@comment.commentGroup_id=@comment.id
			@r=@comment.save
		end
		if @r
			render :json=>[@comment.id,@comment.commentGroup_id,@comment.user.username,@comment.created_at.strftime("%m %d,%Y %H:%M:%S")]
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
		@comment.content=params[:content]
		@comment.group_id=params[:group_id]
		@comment.commentGroup_id=params[:commentGroup_id]
		if @comment.save
			render :json=>[@comment.id,@comment.user.username,@comment.created_at.strftime("%m %d,%Y %H:%M:%S")]
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
