class TripPoint < ActiveRecord::Base
	belongs_to :trip
	belongs_to :place
	belongs_to :user
	belongs_to :group	

	has_one :journey, :dependent=>:destroy
	has_one :micropost, :dependent=>:destroy
	has_one :full_post, :dependent=>:destroy
	has_many :checkin_points, :dependent=>:destroy

	def has_journey
		journey
	end

	def gen_journey(title)
		if(!has_journey)
			create_journey
			journey.title=title
			journey.trip_id=trip_id
			journey.person_id=person_id
			journey.save
		end
	end

	def checkin(label)
		checkin_points.create(:label=>label,:person_id=>person_id,:trip_id=>trip_id)
	end
	
end
