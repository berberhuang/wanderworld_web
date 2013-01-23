class FullpostController < ApplicationController
	def savePost	
		@trip=isTripExist(params[:trip_id])
		if @trip
			if(permissionCheck(@trip))
				if @t=FullPost.find_by_trip_point_id(params[:tripPoint_id])
					@t.article=params[:content]
					if @t.save
						render :text=>'1'
					else
						render :text=>'0'
					end
				else
					if(params[:content]=='')
						render :text=>'0';
						return
					end
					@t=FullPost.new
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
		if @t=FullPost.find_by_trip_point_id(params[:tripPoint_id])
			render :json=>[params[:item_id],@t.article]
		else
			render :json=>[params[:item_id],'']
		end
	end

	def isExist
		if @t=FullPost.find_by_trip_point_id(params[:tripPoint_id])
			if(/^(<[^<>]*>)*$/.match(@t.article))
				render :json=>[params[:item_id],false]
			else
				render :json=>[params[:item_id],true]
			end
		else
			render :json=>[params[:item_id],false]
		end
	end	

	def isTripExist trip_id
		@t=Trip.find_by_id(trip_id)
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
