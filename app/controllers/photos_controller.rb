class PhotosController < ApplicationController
  def all
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

  def album			
	@trip_id=params[:id]
	@photo_rows=Photo.select('*').where('trip_id=?',@trip_id).order('created_at ASC')
	@photo_src=[]
	@photo_rows.each do |p|
		@photo_src.push({
			:picture=>p.img(:thumb),
			:source=>p.img(:original)
		})
	end
	
	respond_to do |format|
		format.html
		format.json {render json: @photo_src}
	end

  end

  def photo
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

	

	
	def uploadPhoto
		@photo = Photo.create(params[:photo])
		@photo.user_id=session[:user_id]
		
		t=Trip.find(@photo.trip_id)
		if t&&t.user_id==@photo.user_id
			@auth=true
		end

		if @auth&&@photo.save
			resp=@photo.to_jq_upload
			respond_to do |format|
				format.all {render json: {files: [resp]},status: :created}
			end
		else
			respond_to do |format|
				format.all {render json: @photo.errors,status: :unprocessable_entity}
			end
		end
	end
end
