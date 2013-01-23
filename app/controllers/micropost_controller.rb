class MicropostController < ApplicationController
	def savePost	
		@trip=isTripExist(params[:trip_id])
		if @trip
			if(permissionCheck(@trip))
				if @t=Micropost.find_by_trip_point_id(params[:tripPoint_id])
					@t.article=params[:content]
					if @t.save
						render :text=>'1'
					else
						render :text=>'0'
					end
				else
					@t=Micropost.new
					@t.user_id=session[:user_id]
					@t.trip_id=params[:trip_id]
					@t.trip_point_id=params[:tripPoint_id]
					@t.article=params[:content]
					if @t.save
						render :text=>'1'
					else
						render :text=>'0'
					end
				end
			end
		end
	end


	def getPost
		@t=Group.find_by_id(params[:group_id])

		if @t.trip.user.id==session[:user_id]||@t.public
			if @t=@t.trip_points.sort!{|a,b| a.sort_id<=>b.sort_id}
				sort_ids=[]
				article=[]
				@t.each_with_index do |tp,i|
					sort_ids[i]=tp.sort_id
					if tp.micropost
						article[i]=tp.micropost.article
					else
						article[i]=''
					end
				end
				
				render :json=>[params[:group_id],sort_ids,article]
			else
				render :json=>[params[:group_id],nil]
			end
		else
				render :json=>[params[:group_id],nil]
		end
	end



	def getPostDescription

		if @t=Micropost.find_by_trip_point_id(params[:tripPoint_id])
			if @t.trip_point.group.public||@t.user_id==session[:user_id]
				render :json=>[params[:item_id],@t.article.gsub(/<[^>]*>/,'').slice(0,50)+'...']
			else
				render :json=>[params[:item_id],'']
			end
		else
			render :json=>[params[:item_id],'']
		end
	end

	def isTripExist trip_id
		@trip=Trip.find_by_id(trip_id)
	end

	def permissionCheck trip_obj
		if trip_obj
			if trip_obj.user_id==session[:user_id]
				return trip_obj
			end
		else
				return nil
		end
	end

	def admCheck
		if(!UserSession.find)
			redirect_to '/rapid/index'
			return nil
		else
			return true
		end
	end
end
