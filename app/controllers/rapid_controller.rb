class RapidController < ApplicationController
	def index		
		@newuser=User.new
		@user_session=UserSession.new
		@trip_id=params[:id]
		@tp_id=params[:tp_id]	
		@user_id=params[:user_id]

		if @trip_id && @tp_id
			logPosition '/'+@trip_id+'/'+@tp_id
		elsif @trip_id
			logPosition '/'+@trip_id
		else
			logPosition '/'
		end

		#如果id不正常或不存在 導回首頁
		if @trip_id
			if @trip_id.to_i.to_s!=@trip_id
				#支援輸入人名的能力
				if( t=User.where(["username = ? AND fbid IS NOT NULL",params[:id]]).all[0])
					if(@trip=t.trips[0])
						redirect_to '/'+@trip.id.to_s
						return
					end
				end
				redirect_to '/'
				return
			end
		else
			if @user_id
				session[:profile_user_id]=@user_id
			end
		end
	end

	def triplist
		@newuser=User.new
		@user_session=UserSession.new
	
		@user_id=params[:id]
		if @user_id.to_i.to_s!=@user_id
			if( t=User.where(["username = ? AND fbid IS NOT NULL",@user_id]).all[0])
				if(t.id)
					redirect_to '/rapid/index?user_id='+t.id.to_s
					return
				end
			end
			
			redirect_to '/'
			return
		end
		redirect_to '/rapid/index?user_id='+@user_id
	end

#	def lookingAround
#		logPosition '/rapid/lookingAround'
#		@newuser=User.new
#		@user_session=UserSession.new
#		
#		@trip_list=Micropost.find(:all,:conditions=>['article != ? ','<br><br><br><br><br><br>'], :limit=>6,:order=>'updated_at DESC',:group=>'trip_id')
#		@hot_trip_description=[]
#		@trip_list.each_with_index do |item,index|
#			@hot_trip_description[index]=getPostDescription(item.article)		
#		end
#	end

	def getPostDescription article
		return article.gsub(/<[^>]*>/,'').gsub(/&nbsp;/,' ').slice(0,60)+'...'
	end

	def test
		@newuser=User.new
		@user_session=UserSession.new
	end

	def logPosition str
		session[:url]=str
	end	

end
