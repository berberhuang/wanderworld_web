class Place < ActiveRecord::Base
	#validates :name ,:uniqueness=>true
	validates_uniqueness_of :name, :scope=>[:city]
	has_many :trip_points
	has_many :trips
	has_many :photos
	has_many :microposts,:through=>:trip_points,:dependent=>:destroy
	has_many :journey,:through=>:trip_points,:dependent=>:destroy
end
