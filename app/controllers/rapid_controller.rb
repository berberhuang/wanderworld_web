class RapidController < ApplicationController
	def index		
		@newuser=User.new
		@user_session=UserSession.new
				
		@trip_id=params[:id]
		@journal_id=params[:tp_id]	
		
		#從處理要求triplist要求
		@user_id = params[:user_id]
		
		#如果id不正常或不存在 忽略指定參數
		if @trip_id && @trip_id.to_i.to_s!=@trip_id || !Trip.select('id').find_by_id(@trip_id.to_i)
			@trip_id = nil
			@journal_id = nil
		end
		
		if @journal_id && @journal_id.to_i.to_s!=@journal_id || !Group.select('id').find_by_id(@journal_id.to_i)
			@journal_id = nil
		end
		
		#檢查完畢
		
		if @trip_id && @journal_id
			@url= '/'+@trip_id+'/'+@journal_id
			logSrcURL @url
		elsif @trip_id
			@url= '/'+@trip_id
			logSrcURL @url
		else
			if @user_id && User.select('id').find_by_id(@user_id.to_s)
				@triplist=true
				@url= '/rapid/triplist/'+@user_id
				logSrcURL = @url
			elsif session[:user_id]
				@triplist=true
				@user_id=session[:user_id].to_s
				@url= '/rapid/triplist/'+@user_id
				logSrcURL = @url

			else
				redirect_to '/'
			end
		end
		

		if @trip_id
			@trip_selected=true

			@trip_info=Trip.find(@trip_id)
			@author=@trip_info.user
			@author_id=@author.id
			@author_name=@author.username
			if(@author.fbid)
				@author_avatar='https://graph.facebook.com/'+@author.fbid+'/picture?type=large '
			end
			
			add_count_on_trip @trip_id, @trip_info
			@groups=Group.order('sort_id ASC').where(:trip_id=>@trip_id)
			@tripPoints=TripPoint.select('trip_points.id,group_id,sort_id,place_id,name,longitude,latitude').order('group_id,sort_id ASC').joins(:place).where(:trip_id=>@trip_id)
				
			@journal_selected=false
			@contents=[]
			@public=false
			@journal_name=nil
			@isOwner=false;
			if @trip_info.user_id.to_s==session[:user_id].to_s
				@isOwner=true
			end
			
			if @journal_id 
				@journal_selected=true
				@journal=Group.select('title,public,photo,count').find_by_id(@journal_id)
				
				add_count_on_journal @journal_id, @journal

				@journal_name=@journal.title
				@public=@journal.public
				if @isOwner or @public
					@contents=Micropost.select('article,trip_points.sort_id,trip_points.id').joins(:trip_point).where('trip_points.group_id=?', @journal_id).order('trip_points.sort_id ASC')
				end
			end		
		
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
		@photo=Photo.new
	end

	def logSrcURL str
		session[:url]=str
	end	

	def add_count_on_trip id, trip 
		if session[:trip_log]==nil
			session[:trip_log]={}
		end

		if !session[:trip_log][id]
			session[:trip_log][id]=true
			trip.count+=1
			trip.save!
		end
	end

	def add_count_on_journal id, journal
		if session[:journal_log]==nil
			session[:journal_log]={}
		end

		if !session[:journal_log][id]
			session[:journal_log][id]=true
			journal.count+=1
			journal.save!
		end
	end
	def trippage
		@newuser=User.new
		@user_session=UserSession.new
		@user_id = params[:id]

		if @user_id 
			    @author_id=@user_id 
				@trips=Trip.order('start_date DESC').where(:user_id=>@user_id)
				@user = User.find_by_id(@user_id)
				if !@user
					redirect_to '/'
					return 
				end
				@author_name=@user.username
				if @user.fbid
					@author_avatar='https://graph.facebook.com/'+@user.fbid+'/picture?type=large '
				end
				if @user.id.to_s==session[:user_id].to_s
					@isOwner=true
				end
		else
			if session[:user_id]
				redirect_to '/rapid/trippage/'+session[:user_id].to_s
			else
			redirect_to '/'
			end
		end
	end
end
