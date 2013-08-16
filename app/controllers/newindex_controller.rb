class NewindexController < ApplicationController
	def index
		
		@newuser=User.new
		@user_session=UserSession.new
		
	  
		@pop_order_str='groups.count*(groups.created_at/3600) DESC'
		@new_order_str='groups.created_at DESC'
	  
	  
		@pop_groups=Group.joins(:trip,:user).where(:public=>true).order(@pop_order_str).select('username,fbid,name,groups.id,groups.user_id,photo,trip_id,title,abstract').limit(2)
		@new_groups=Group.joins(:trip,:user).where(:public=>true).order(@new_order_str).select('username,fbid,name,groups.id,groups.user_id,photo,trip_id,title,abstract').limit(2)
	

	end

	def banded
		if flash[:login]
			redirect_to '/rapid/triplist/'+session[:user_id].to_s
			return
		end
	
		if params[:id]
			redirect_to '/rapid/index/'+params[:id]
			return
		end		
		
		if UserSession.find
			redirect_to '/newindex/browse'
		else		
			logPosition '/'
			@newuser=User.new
			@user_session=UserSession.new
		end
	end

	
	
	def orbit
		if params[:id]
			redirect_to '/rapid/index/'+params[:id]
		end		

		if UserSession.find
			redirect_to '/rapid/index'
		else		
			logPosition '/'
			@newuser=User.new
			@user_session=UserSession.new
		end
	end
	
	def browse

		if flash[:login]
			redirect_to '/rapid/triplist/'+session[:user_id].to_s
			return
		end
	
		@offset=params[:p]
		@type=params[:type]
		if !@offset
			@offset=0
		end	
		
		if !@type
			@type='pop'
		end

		if UserSession.find
			#redirect_to '/rapid/index'
			logPosition '/'
			@newuser=User.new
			@user_session=UserSession.new
		else		
			logPosition '/'
			@newuser=User.new
			@user_session=UserSession.new
		end
	end
	

	def logPosition str
		session[:url]=str
	end	
end
