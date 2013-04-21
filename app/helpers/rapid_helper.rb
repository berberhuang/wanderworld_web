# encoding: UTF-8
require 'erb'
module RapidHelper
	def tripList_gen(trips)
		str=''
		iter_date=nil
		now=Date.current
		now_s=false
		trips.each do |t|
			if t.start_date.year!=iter_date
				if t.start_date.year > now.year
					iter_date=t.start_date.year+1
				end
				if iter_date
					str+='<li><a>'+iter_date.to_s+'</a></li>'
				end
				iter_date=t.start_date.year
			end
			if !now_s && t.start_date <= now
				str+='<li><a>Now</a></li>'
				now_s=true
			end
			
			t.name=ERB::Util.html_escape(t.name)
			str+='<div id="trip_list_'+t.id.to_s+'" class="trip_list_info">'
			
			str+='<div class="trip_edit" title="編輯"></div>'
			str+='<div onclick="loadTrip('+t.id.to_s+')">'
			str+='<div class="trip_list_date">'+t.start_date.to_s+'</div>'
			str+='<div class="trip_list_name">'+t.name+'</div>'
			str+='</div>'	
			str+='</div>'
		end
		str+='<li><a>'+iter_date.to_s+'</a></li>'	
		return str.html_safe
	end

	def tripName_gen(trip_info)
		str='<div style="cursor:pointer;">'
		str+='<a>'+ERB::Util.html_escape(trip_info.name)+'</a>'
		str+='</div>'
		return str.html_safe
	end
	
	def tripDate_gen(trip_info)
		str='<div style="cursor:pointer;">'
		if trip_info.start_date == trip_info.end_date
			str+='<a>'+trip_info.start_date.to_s+'</a>'
		else
			str+='<a>'+trip_info.start_date.to_s+' - '+trip_info.end_date.to_s+'</a>'
		end
		str+='</div>'
		return str.html_safe
	end

	def tripPointList_gen(groups,tripPoints)
		str='<div class="trip_point_all">'
		str+='<div id="group_buttom" style="clear:both;display:block"></div>'
		seq_num=1
		groups.each do |g|
			str+='<div id="trip_point_group_'+g.id.to_s+'" class="trip_point_group">'
			str+='<div class="trip_point_title"><a>'+g.title+'</a></div>'

			str+='<ul class="trip_point">'
			
			iter=0
			until !tripPoints[iter]||tripPoints[iter].group_id==g.id
				iter+=1
			end
			while tripPoints[iter]&&tripPoints[iter].group_id==g.id do
				str+='<li value="'+tripPoints[iter].id.to_s+'">'
				str+='<div class="point">'
				str+='<img class="point_mark" alt="'+seq_num.to_s+'" \>'
				str+='<a class="point_name">'+tripPoints[iter].name+'</a>'
				str+='</div>'
				str+='</li>'
				iter=iter+1
				seq_num+=1
			end
			
			str+='</ul>'			

			str+='</div>'
		end
		str+='</div>'
		return str.html_safe
	end
end
