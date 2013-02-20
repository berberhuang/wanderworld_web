class AdminController < ApplicationController
	def tripList
		case(session[:user_id])
			when 17,18,26
				@trip=Trip.find(:all,:order=>'id DESC')
				return
		end
		redirect_to '/'
	end
	
	def orbit_edit
		@newuser=User.new
		@user_session=UserSession.new
		case(session[:user_id])
			when 17,18,26
				@trip=Trip.find(:all,:order=>'id DESC')
				return
		end
		redirect_to '/'
	end
end
