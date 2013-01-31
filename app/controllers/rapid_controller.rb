class RapidController < ApplicationController
	def index		
		@newuser=User.new
		@user_session=UserSession.new
				
		@trip_id=params[:id]
		@trip_point_id=params[:tp_id]	
		
		#從處理要求triplist要求
		@user_id = params[:user_id]
		
		#如果id不正常或不存在 忽略指定參數
		if @trip_id && @trip_id.to_i.to_s!=@trip_id || !Trip.select('id').find_by_id(@trip_id.to_i)
			@trip_id = nil
			@trip_point_id = nil
		end
		
		if @trip_point_id && @trip_point_id.to_i.to_s!=@trip_point_id || !TripPoint.select('id').find_by_id(@trip_point_id.to_i)
			@trip_point_id = nil
		end
		
		#檢查完畢
		
		if @trip_id && @trip_point_id
			@url= '/'+@trip_id+'/'+@trip_point_id
			logSrcURL @url
		elsif @trip_id
			@url= '/'+@trip_id
			logSrcURL @url
		else
			if @user_id && User.select('id').find_by_id(@user_id.to_s)
				@triplist=true
				@url= '/rapid/triplist/'+@user_id
				logSrcURL = @url
				return
			end
			if session[:user_id]
				@triplist=true
				@user_id=session[:user_id].to_s
				@url= '/rapid/triplist/'+@user_id
				logSrcURL = @url
				
				return
			end
			redirect_to '/'
		end
		
	end

	def triplist
		@newuser=User.new
		@user_session=UserSession.new
	
		@user_id=params[:id]
		if @user_id.to_i.to_s!=@user_id		
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

	def logSrcURL str
		session[:url]=str
	end	

end
