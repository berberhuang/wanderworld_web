class FbController < ApplicationController
	def channel
		render :layout=>false
	end
	def update
		@user_id=params[:user_id]
		@user=User.find(@user_id)
		@trip=@user.trips
		@tp=[]
		@trip.each_with_index do |t,i|
			@tp[i]=t.trip_points
		end	
		render :json=>[@trip,@tp]
	end
end
