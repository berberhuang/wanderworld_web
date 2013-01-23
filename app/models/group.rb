class Group < ActiveRecord::Base
	belongs_to :trip
	has_many :trip_points,:dependent=>:destroy
end
