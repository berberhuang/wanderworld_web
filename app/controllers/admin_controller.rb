class AdminController < ApplicationController
	def tripList
		case(session[:user_id])
			when 17,18,26
				@trip=Trip.find(:all,:order=>'id DESC')
				return
		end
		redirect_to '/'
	end
end
