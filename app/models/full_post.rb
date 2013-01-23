class FullPost < ActiveRecord::Base
	belongs_to :trip_point
	belongs_to :user
	belongs_to :trip
end
