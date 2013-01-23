class CheckinPoint < ActiveRecord::Base
	belongs_to :trip_point
	belongs_to :trip
	belongs_to :user
	has_one :journey

	validates :trip_point,:presence=>true

end
