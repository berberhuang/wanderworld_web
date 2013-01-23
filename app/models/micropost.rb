class Micropost < ActiveRecord::Base
	belongs_to :trip_point
	belongs_to :trip
	belongs_to :place
	belongs_to :user
end
