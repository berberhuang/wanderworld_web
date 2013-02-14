class IndexController < ApplicationController
	def index
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

	
	def lab
		UserSession.find.username;
	end

	def logPosition str
		session[:url]=str
	end	
end
