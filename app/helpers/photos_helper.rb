# encoding: UTF-8
module PhotosHelper

	def photo_tag picture, source
		
    		'<li><a class="th gallery" href="'+source+'"><img  src="'+picture+'"></a></li>'
	end

	def album_tag trip_id, trip_name, cover_src, number_of_photo
		
            '<li><div class="album gallery" href="#">'+
                '<div><a href="/photos/album/'+trip_id.to_s+'"><img src="'+cover_src+'" /></a></div>'+
                '<div class="album-info">'+
                   '<h6 class="margin-bottom:0px;"><a href="/photos/album/'+trip_id.to_s+'">'+trip_name+'</a></h6>'+
                    '<p class="subheader">'+number_of_photo.to_s+'張照片</p>'+
               '</div></div></li>'
	end
end
