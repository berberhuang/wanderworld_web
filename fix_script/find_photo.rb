Group.where(:public=>true).each do |g|
	g.trip_points.order('sort_id ASC').each do |t|
		m=t.micropost
		if m
			str=m.article[/<img [^>]*src="[^"]*"/]
			if str 
				str=str[/src="[^"]*"/].split('"')[1]
				
				print str
				g.photo=str
				g.save
				break
			end
		end
	end
end
