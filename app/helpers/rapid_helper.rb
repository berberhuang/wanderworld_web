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
				str+='<li><a class="selected">Now</a></li>'
				now_s=true
			end
			
			t.name=ERB::Util.html_escape(t.name)
			str+='<li>'
			str+='<div id="trip_list_'+t.id.to_s+'" class="trip_list_info arrow_box white">'
			str+='<div class="trip_edit"></div>'
			str+='<div onclick="loadTrip('+t.id.to_s+')">'
			str+='<div class="trip_list_date">'+'<i class="foundicon-flag"></i>'+t.start_date.to_s+'</div>'
			str+='<div class="trip_list_name">'+t.name+'</div>'
			str+='</div>'	
			str+='</div>'
			str+='</li>'
		end
		str+='<li><a>'+iter_date.to_s+'</a></li>'	
		return str.html_safe
	end

	def tripName_gen(trip_info)
		tripName=ERB::Util.html_escape(trip_info.name)
		str='<div class="row" id="trip_name_editDiv" style="cursor:pointer; height:4em; overflow:hidden;" title="'+tripName+'">'
		str+='<h4><a>'+tripName+'</a></h4>'
		str+='</div>'
		return str.html_safe
	end
	
	def tripDate_gen(trip_info)
		str='<div style="cursor:pointer;"><h4 class="white"></h4>'
		if trip_info.start_date == trip_info.end_date
			str+='<a>'+trip_info.start_date.to_s.gsub('-','/')+'</a>'
		else
			str+='<a>'+trip_info.start_date.to_s.gsub('-','/')+' - '+trip_info.end_date.to_s.gsub('-','/')+'</a>'
		end
		str+='</div>'
		return str.html_safe
	end

	def tripPointList_gen(groups,tripPoints)
		str='<div id="group_button" class="row"></div>'
		seq_num=1
		groups.each do |g|
			str+='<div id="trip_point_group_'+g.id.to_s+'" class="trip_point_group row" data-id="'+g.id.to_s+'" data-sortid="'+g.sort_id.to_s+'">'
			str+='<div class="journal_title large-9 columns"><h4><a href="#">'+g.title+'</a></h4><input placeholder="輸入遊記名稱" style="display:none;"></div>'
			str+='<div class="trip_point_edit large-3 columns right"></div>'
			str+='<ul class="trip_point">'
			
			iter=0
			until !tripPoints[iter]||tripPoints[iter].group_id==g.id
				iter+=1
			end
			while tripPoints[iter]&&tripPoints[iter].group_id==g.id do
				str+='<li>'
				
				str+='<div class="point columns"' 
				str+=' data-id="'+tripPoints[iter].id.to_s+'"'
				str+=' data-sort_id="'+tripPoints[iter].sort_id.to_s+'"'
				str+=' data-latitude="'+tripPoints[iter].latitude.to_s+'"'
				str+=' data-longitude="'+tripPoints[iter].longitude.to_s+'"'
				str+='>'
				str+='<div class="row">' 
				str+='<div class="large-2 columns">'
				str+='<div class="row">'
				str+='<img class="point_mark" alt="'+seq_num.to_s+'" \>'
				str+='</div>'
				str+='</div>'
				str+='<div class="large-8 columns">'
				str+='<div class="row">'
				str+='<a class="point_name">'+tripPoints[iter].name+'</a>'
				str+='</div>'
				str+='</div>'
				str+='<div class="point_edit large-2 columns">'
				str+='</div>'
				str+='</div>'
				str+='</div>'
				str+='</li>'
				iter=iter+1
				seq_num+=1
			end
			
			str+='</ul>'			
			str+='<div id="add_trip_point_div"></div>'
			str+='</div>'
		end
		return str.html_safe
	end
end
