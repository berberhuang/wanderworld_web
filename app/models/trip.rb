class Trip < ActiveRecord::Base
	belongs_to :user
	has_many :trip_points ,:dependent=>:destroy
	has_many :places ,:through=>:trip_points
	has_many :micropost ,:through=>:trip_points
	has_many :full_post, :through=>:trip_points
	has_many :journey,:through=>:trip_points
	has_many :checkin_points, :through=>:trip_points	
	has_many :groups,:dependent=>:destroy
	has_many :photos,:dependent=>:destroy
	
	validates :user, :presence=>true
	
	
	def insert_trip_point(place)
		if(p=Place.find_by_name(place))
			trip_points.create(:place_id=>p.id,:person_id=>person_id)
		end
	end
end
