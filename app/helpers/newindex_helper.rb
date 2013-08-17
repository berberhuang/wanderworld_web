module NewindexHelper
	def journal_column trip_id,journal_id,author_name, fbid,title,abstract,img
		if !img
			place=Place.joins(:trip_points).where(:trip_points=>{:group_id=>journal_id}).order('sort_id ASC').select('latitude,longitude')

			pos_str=''
			place.each do |p|
				pos_str+='%7C'+p.latitude.to_s+'%2C'+p.longitude.to_s
			end
			
			if place.size == 1
				img='http://maps.googleapis.com/maps/api/staticmap?maptype=satellite&zoom=8&size=400x300&markers=color%3Ablue'+pos_str+'&sensor=false'
			else
				img='http://maps.googleapis.com/maps/api/staticmap?maptype=satellite&size=400x300&markers=color%3Ablue'+pos_str+'&sensor=false'
			end
		end

		abstract='' if !abstract

      		str='<li>'
        	str+='<div class="journal-column">'
          	str+='<a href="/'+trip_id.to_s+'/'+journal_id.to_s+'">'
            	str+='<img src="'+img+'" />'
            	str+='<div class="caption">'
              	str+='<ul class="inline-list">'
                str+='<li>'
		if fbid
                	str+='<img  class="user-avatar" src="https://graph.facebook.com/'+fbid+'/picture" />'
                else
                	str+='<img  class="user-avatar" src="/assets/user_avatar.png"/>'
                end
		str+='</li>'
                str+='<li>'+author_name+'</li>'
              	str+='</ul>'
            	str+='</div>'
         	str+='</a>'
        	str+='</div>'
        	str+='<h4>'+title+'</h4>'
        	str+='<p class="show-for-medium-up">'+abstract+'</p>'
      		str+='</li>'
		return str.html_safe
	end


	def orbit_item journal_id,img,abstract
		@g=Group.select('*').joins(:user).find_by_id(journal_id)
		return '' if !@g
  		str='<li>'
    		str+='<img src="'+img+'" class="slide-photos"/>'
    		str+='<div class="orbit-caption">'
      		str+='<div class="large-3 columns">'
          str+='<h3 class="white">'+@g.title+'</h3>'
      		str+='<ul class="inline-list">'
        	str+='<li>'
          	if @g.fbid
                	str+='<img  class="user-avatar" src="https://graph.facebook.com/'+@g.fbid+'/picture" />'
          	else
            		str+='<img  class="user-avatar" src="/assets/user_avatar.png"/>'
          	end
        	str+='</li>'
        	str+='<li>'+@g.username+'</li>'
      		str+='</ul></div>'
          str+='<div class="large-9 columns"><p class="white">'+abstract+'</p</div>'
		str+='</div>'
		str+='</li>'
		return str.html_safe
	end

	def classic_item journal_id,img,abstract
		@g=Group.select('*').joins(:user).find_by_id(journal_id)
		return '' if !@g
      		str='<li>'
        	str+='<div class="journal-column">'
         	str+='<a href="#">'
            	str+='<img class="classic-image" src="'+img+'" />'
            	str+='<div class="caption">'
              	str+='<ul class="inline-list">'
                str+='<li>'
		if @g.fbid
                	str+='<img  class="user-avatar" src="https://graph.facebook.com/'+@g.fbid+'/picture" />'
                else
                	str+='<img  class="user-avatar" src="/assets/user_avatar.png"/>'
                end
		
		str+='</li>'
                str+='<li>'+@g.username+'</li>'
              	str+='</ul></div></a></div>'
        	str+='<h4>'+@g.title+'</h4>'
        	str+='<p class="show-for-medium-up">'+abstract+'</p>'
      		str+='</li>'
		return str.html_safe
	end
end
