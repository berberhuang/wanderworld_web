class NewindexController < ApplicationController
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
