require 'open-uri'

s3=AWS::S3.new
bucket=s3.buckets['wanderworld']

@group=Group.find(:all,:conditions=>'public=true')

@group.each do |g|

	sleep 5

	@o=bucket.objects['journal_staticmap'+g.id.to_s+'.jpg']									

	@place=[]
	g.trip_points.each do |t| 
		@place.push(t.place)
	end

	if @place.size >=8 
		@place.slice!(1,7)
	end

	@pos_str=''
	@place.each do |p|
		@pos_str+='%7C'+p.latitude.to_s+'%2C'+p.longitude.to_s
	end

	if @place.size==1
		@url='http://maps.googleapis.com/maps/api/staticmap?maptype=terrain&zoom=7&size=200x300&markers=color%3Ablue'+@pos_str+'&sensor=false'
	else
		@url='http://maps.googleapis.com/maps/api/staticmap?maptype=terrain&size=200x300&markers=color%3Ablue'+@pos_str+'&sensor=false'

	end
	@o.write(URI(@url).open)

end
