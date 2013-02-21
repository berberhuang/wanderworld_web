class UserSessionController < ApplicationController
	require 'oauth2'
	def login
		@user_session=UserSession.new
	end
	
	
	def create_by_index
		@user_session=UserSession.new(params[:user_session])
		if @user_session.save
			flash[:notice]='login successful'
			@curr_user=UserSession.find
			user=User.find_by_email(@user_session.email)
			session[:username]=user.username
			session[:user_id]=user.id
			redirect
			#redirect_to :back
			
		else
			flash[:loginfail]=true
			redirect
			#redirect_to :back
		end
	end
	
	def getAccessToken
		code=params[:code]
		if(code)
			begin
			oauth_client=OAuth2::Client.new('369699423051845','72c650436a0732efd635938e6c43901b',:site=>'https://graph.facebook.com')
			token=oauth_client.web_server.get_access_token(code,:redirect_uri=>'http://www.wanderworld.com.tw/userSession/getAccessToken')

			rescue OAuth2::HTTPError=>e
				render :text=>e.response.body
			end

			  begin
			    user = JSON.parse(token.get('/me'))
			  rescue Exception => e
			    user=e.response.body
			  end
			
			session[:avatar_src]='https://graph.facebook.com/'+user['id']+'/picture?type=large '
	
			username_id='fb'+user['id'][3,6]+user['email']
			password=user['id'][2,4]+user['id'][0,2]
			@user=User.find_by_email(username_id)
			if @user
				@user.fbid=user['id']
				@user.save
				@user_session=UserSession.new :email=>username_id,:password=>password
				if @user_session.save
					flash[:notice]='login successful'
					session[:username]=user['name']
					session[:user_id]=@user.id
					session[:fbid]=@user.fbid
					if(session[:update]==nil)
						session[:update]="d"
					end
					redirect
					#redirect_to :back
				else
					flash[:loginfail]=true
					render :text=>'login by fb fail'
				end
			else
				@user=User.new :email=>username_id,:username=>user['name'],:password=>password,:password_confirmation=>password,:fbid=>user['id']
				if @user.save
					@user_session=UserSession.new :email=>username_id,:password=>password
					if @user_session.save
						flash[:notice]='login successful'
						session[:username]=user['name']
						session[:user_id]=@user.id
						session[:fbid]=@user.fbid
						redirect
						#redirect_to :back
					else
						flash[:loginfail]=true
						render :text=>'login by fb fail'
					end
				else
					render :text=>'create account by fb fail'	
				end
			end	
		else
			render :text=>'error'
		end
	end
	

	def logout
		@curr_user=UserSession.find
		@curr_user.destroy
		session[:username]=nil
		session[:user_id]=nil
		session[:avatar_src]=nil
		session[:fbid]=nil
		redirect_to '/'
	end

	def redirect
		if session[:url]
			redirect_to session[:url]
		else
			redirect_to '/'
		end
	end
end
