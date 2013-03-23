class NewindexController < ApplicationController
	def banded
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
		@offset=params[:p]
		@type=params[:type]
		if !@offset
			@offset=0
		end	
		
		if !@type
			@type='pop'
		end

		if UserSession.find
			redirect_to '/rapid/index'
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
