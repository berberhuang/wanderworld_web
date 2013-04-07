class Group < ActiveRecord::Base
	belongs_to :trip
	belongs_to :user
	has_many :trip_points,:dependent=>:destroy
	has_many :comments,:dependent=>:destroy
end
