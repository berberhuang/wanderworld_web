class UserController < ApplicationController
        def new
                @user=User.new
        end

        def create
			@user=User.new params[:user]
			if @user.password.length>=6 && @user.password.length<=20 && @user.save
				flash[:notice]='sucessful'
			
				@user_session=UserSession.new params[:user]
				if @user_session.save
					flash[:notice]='login successful'
					flash[:login]=true
					@curr_user=UserSession.find
					user=User.find_by_email(@user_session.email)
					session[:username]=user.username
					session[:user_id]=user.id
					session[:fbid]=user.fbid
				
					redirect_to '/'
				else
					flash[:loginfail]=true
				end
			else
				flash[:signupfail]=true
				redirect
			end
        end
	
	def fblogin
		#username,id
		
	end		

	def hasPermission
		if session[:user_id].to_i==params[:id].to_i
			render :json=>true
		else
			render :json=>false
		end	
	end
	
	def redirect
		if session[:url]
			redirect_to session[:url]
		else
			redirect_to '/'
		end
	end
end
