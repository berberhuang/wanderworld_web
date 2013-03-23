require 'open-uri'
class TripController < ApplicationController

	def tripList
		@trip=Trip.new
		@triplist=User.find_by_id(session[:user_id]).trips.find(:all,:order=>'id DESC')
	end

	def editTripName
		@trip=isTripExist(params[:id])
		if @trip
			if(permissionCheck(@trip))
				@trip.name=params[:new_name]
				@trip.save
				render :text=>'ok'
			else
				render :text=>'fail'
			end
		else
			render :text=>'yes'
		end
	end

	def editTripDate
		@trip=isTripExist(params[:id])
		if @trip
			if(permissionCheck(@trip))
				@trip.start_date=params[:start_date]
				@trip.end_date=params[:end_date]
				@trip.save
				render :text=>'ok'
			else
				render :text=>'fail'
			end
		else
			render :text=>'yes'
		end
		
	end

	def getTripList
		@user
		if(params[:id])
			if @user=User.find_by_id(params[:id])
				@triplist=@user.trips.find(:all,:order=>'start_date DESC')
			end
		else
			if @user=User.find_by_id(session[:user_id])
				@triplist=@user.trips.find(:all,:order=>'start_date DESC')
			end
		end
		render :json=>[@triplist,@user]
	end
	
	def getTripPointList
		@trip=isTripExist(params[:id])
		if @trip
			@trip.count+=1
			@trip.save	
			
			@group_list=@trip.groups.find(:all,:order=>'sort_id ASC')
			
			@tp=@trip.trip_points.find(:all,:order=>'sort_id ASC')
			@place=[]
			#@group_title=Hash.new
			@tp.each_with_index do |item,index|
				@place[index]=item.place
			end

			#@trip.groups.each do |g|
			#	@group_title[g.id]=g.title
			#end
			#render :json=>[@tp,@place,@group_title]
			render :json=>[@group_list,@tp,@place]
		else
			render :json=>nil
		end
	end

	def deleteTrip
		@trip=isTripExist(params[:id])
		if admCheck && @trip
			if permissionCheck(@trip)
				@trip.destroy
				render :text=>'success'	
			else
				render :text=>'fail'
			end
		else
			render :text=>'fail'
		end
	end
	
	def getTrip
		@trip=isTripExist(params[:id])
		if @trip
			render :json=>[@trip,@trip.user.username,@trip.user.fbid]
		else
			render :json=>nil
		end
	end

	def isGroupPublic
		@g=Group.find_by_id(params[:id])
		if @g.public
			render :json=>true
		else
			render :json=>false
		end
	end

	def setGroupPublic
		@g=Group.find_by_id(params[:id])
		if @g&&@g.trip.user.id==session[:user_id]
			@g.public=true
			@g.save
			
			if Rails.env == "production"			
				if !bucket
					s3=AWS::S3.new
					bucket=s3.buckets['wanderworld']
				end
				
				@o=bucket.objects['journal_staticmap'+group_id+'.jpg']									
				
				@place=[]
				@g.trip_points.each do |t| 
					@place.push(t.place)
				end
				
				if @place.size >=8 
					@place.slice!(1,7)
				end
				
				@pos_str=''
				@place.each do |p|
					@pos_str+='%7C'+p.latitude.to_s+'%2C'+p.longitude.to_s
				end
				
				@url='http://maps.googleapis.com/maps/api/staticmap?maptype=terrain&size=200x300&markers=color%3Ablue'+@pos_str+'&sensor=false'
				
				@o.write(URI(@url).open)
			end
		end
		render :json=>nil
	end

	def getGroupTitle
		@g=Group.find_by_id(params[:id])
		if @g
			render :text=>@g.title
		else
			render :json=>nil
		end

	end

	def editGroupTitle
		@g=Group.find_by_id(params[:id])
		if @g&&@g.trip.user.id==session[:user_id]
			@g.title=params[:title]
			@g.save
			render :json=>true
		else
			render :json=>false
		end
	end

	def createGroup
		@trip=isTripExist(params[:trip_id])	
		if(permissionCheck(@trip))
			@g=Group.new
			if @g
				@sort_id=Group.limit(1).select('sort_id').order('sort_id DESC').find_by_trip_id(params[:trip_id])
				if @sort_id
					@sort_id = @sort_id.sort_id+1
				else
					@sort_id=0
				end
				@g.title=params[:title]
				@g.trip_id=@trip.id
				@g.public=false;
				@g.sort_id=@sort_id
				@g.save
				render :json=>@g.id
				return
			end
		end
		render :json=>false
	end

	def deleteGroup
		@g=Group.find_by_id(params[:id])
		if @g&&@g.trip.user.id==session[:user_id]
			@g.destroy
			render :json=>true
		else
			render :json=>false
		end
	end

	def setGroupTitle
		@g=Group.find_by_id(params[:id])
		if @g
			@g.title=params[:title]
			@g.save
			render :json=>true
		else
			render :json=>false
		end
	end

	def changeGroupOrder   ##  insert_sort_id 被移動物件的sort_id 的新值
		@trip=isTripExist(params[:trip_id])	
		if(permissionCheck(@trip))
			if @trip
				@g=Group.find_by_id(params[:group_id])
				if @g
					@g.sort_id=params[:new_sort_id]
									
					@g.save
				else
					render :json=>nil
					return
				end

				render :json=>true
				return
			end
		end
		render :json=>nil
	end

	def changeTripPointOrder 
		@trip=isTripExist(params[:trip_id])	
		if(permissionCheck(@trip))
			if @trip
				@target=TripPoint.find_by_id(params[:tripPoint_id])
				if @target 
					@target.sort_id=params[:new_sort_id]
					@target.group_id=params[:new_group_id]
					@target.save
				else
					render :json=>nil
					return
				end
				render :json=>true
				return
				
			end
		end
		render :json=>nil
	end

	def oldinsertOrder
		@trip=isTripExist(params[:trip_id])	
		if(permissionCheck(@trip))
			if @trip
				@tp=@trip.trip_points
				bound=TripPoint.find(params[:endpos_id]).sort_id
				@tp.each do |s|
					if s.sort_id >=bound
						s.sort_id+=1
						s.save
					end
				end
				@tmp=TripPoint.find(params[:target])
				if(params[:pos]!='-1')
					@tmp.sort_id=TripPoint.find(params[:pos]).sort_id+1;
				else
					@tmp.sort_id=0;
				end
				@tmp.save
				render :json=>true
			else
				render :json=>nil
			end
		end
	end

	def create_trip
		if admCheck
			t=Trip.new(params[:trip])
			t.user_id=session[:user_id]
			if !t.save
				render :json=>nil
			else
				render :text=>t.id
			end
		end
	end
	
	def findPlace
		if !params[:p_city]
			render :json=>nil		
		elsif		
			@tplace=Place.where(:name=>params[:p_name],:city=>params[:p_city])
			if(@tplace[0])
				render :json=>[@tplace[0].id,@tplace[0].city,@tplace[0].latitude,@tplace[0].longitude,@tplace[0].name]
			elsif
				render :json=>nil
			end
		end
	end

#	def insertPoint
#		if admCheck
#			@tpoint=TripPoint.new(params[:trip_point])
#			if pemissionCheck(isTripExist(@tpoint.trip_id))
#				if !place_id=Place.where(:name=>@tpoint.name,:city=>@tpoint.city)[0]
#					place_id=Place.create(:name=>@tpoint.name,:longitude=>@tpoint.longitude,:latitude=>@tpoint.latitude,:city=>@tpoint.city)
#				end
#				place_id=place_id.id 
#				if !place_id
#					render :json=>nil
#					return 
#				end
#				@tpoint.user_id=session[:user_id]
#				@tpoint.place_id=place_id
#				@tpoint.trip_id=params[:id]
#				@tpoint.save
#				render :json=>[@tpoint.id]
#			else
#				render :json=>nil
#			end
#		end
#	end

	def insertPointById
		@tpoint=TripPoint.new(params[:trip_point])
		if admCheck && @tpoint.place_id
			if permissionCheck(isTripExist(params[:id]))
				if(params[:tripPoint_id]!='-1')				
					if(@tmp=TripPoint.find(params[:tripPoint_id]))
						@tmp.sort_id=@tpoint.sort_id
						@tmp.save
						render :json=>@tmp
						return
					end
				end
				@tpoint.user_id=session[:user_id]
				@tpoint.trip_id=params[:id]
				@tpoint.save
				render :json=>@tpoint
			else
				render :json=>nil
			end
		else
			render :json=>nil
		end
	end

	def removePoint
		if admCheck
			@tp=TripPoint.find(params[:id])
			if(permissionCheck(isTripExist(@tp.trip_id)))
				@tp.destroy
				render :text=>params[:id]
			else
				render :json=>nil
			end
		end
	end
	
	def editPointPos
		if admCheck
			TripPoint.update(params[:id],:longitude=>params[:lng],:latitude=>params[:lat])
			render :text=>'ok'
		end
	end
	
	def getTripCount
		@trip=isTripExist(params[:id])
		if @trip
			render :json=>@trip.count
		else
			render :json=>nil
		end
	end

	def getFriendTripByFbid
		@uid_list=params[:uid_list]
		@trip_list=[]
		@micropost_list=[]
		if @uid_list
			@uid_list.each_with_index do |item,index|
				@user=User.find_by_fbid(item)
				if @user 
					@t=@user.trips
					if @t[0]
						@trip_list[index]=[@t[0].id,@t.length,index]
					else
						@trip_list[index]=[nil,0,index]
					end
					
					Micropost.find(:all,:conditions=>["user_id=? AND article!= ?",@user.id,'<br><br><br><br><br><br>'],:limit=>6,:order=>'updated_at DESC',:group=>'trip_id').each do |item|
						if(@micropost_list[5])
							if(item.updated_at>@micropost_list[5].updated_at)
								@micropost_list.pop()
								@micropost_list.push(item)
								@micropost_list.sort!{|a,b| b.updated_at<=>a.updated_at}
							end
						else
							@micropost_list.push(item)
						end
					end
					
				else
					@trip_list[index]=[nil,0,index]
				end
							
			end
		end
		@author_list=[]
		@tp=[]
		@t_name=[]
		@micropost_list.each_with_index do |item,index|
			@micropost_list[index].article=getPostDescription(@micropost_list[index].article)
			t=item.user
			@author_list[index]=Hash['username',t.username,'fbid',t.fbid]
			t=item.trip_point
			@tp[index]=Hash['id',t.id,'trip_id',t.trip_id,'name',t.place.name]
			@t_name[index]=t.trip.name
		end
		render :json=>[@trip_list,@micropost_list,@tp,@t_name,@author_list]
		
	end


	def getPostDescription article
		return article.gsub(/<[^>]*>/,'').gsub(/&nbsp;/,' ').slice(0,80)+'...'
	end
	def hasPermission
		if permissionCheck (isTripExist(params[:id]))
			render :json=>true
		else
			render :json=>false
		end
	end

	def isTripExist trip_id
		@t=Trip.find_by_id(trip_id)
	end

	def permissionCheck trip_obj
		if trip_obj
			if trip_obj.user_id==session[:user_id]
				return trip_obj
			end
		else
				return nil
		end
	end

	def admCheck
		if(!UserSession.find)
			redirect_to '/rapid/index'
			return nil
		else
			return true
		end
	end
	
end
