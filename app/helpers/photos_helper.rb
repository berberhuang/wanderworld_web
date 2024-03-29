# encoding: UTF-8
module PhotosHelper

	def photo_tag id,picture, source, location_id, show_editor
		
    		str='<li data-id="'+id.to_s+'" data-location_id="'+location_id.to_s+'" style="display:block">'+
        #照片tool
        '<a class="th th-item" href="'+source+'" style="background-image:url(\''+picture+'\')">'+
        '<img src="'+picture+' "class="transparent"></a>'
        if show_editor
          str+='<div id="photoEditor"><a class="photo_delete_button" href="#"><i class="icon-trash"></i></a></div>'
        end
        str+='</li>'
	end

	def album_tag trip_id, trip_name, cover_src, number_of_photo
		
            '<li><div class="album gallery word-break" href="#">'+
                '<a class="th th-item" href="/photos/album/'+trip_id.to_s+'" style="background-image:url('+cover_src+')"></a>'+
                '<div class="album-info">'+
                   '<h5 class="album-name"><a href="/photos/album/'+trip_id.to_s+'">'+trip_name+'</a></h5>'+
                    '<p class="subheader">'+number_of_photo.to_s+'張照片</p>'+
               '</div></div></li>'
	end

  def location_picker location_name,  location_id
      '<li class="labelUnclicked" data-location_id="'+location_id.to_s+'"><a href="#">'+location_name+'</a></li>' 
  end
end
