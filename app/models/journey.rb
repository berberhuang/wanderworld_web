#deprecated
class Journey < ActiveRecord::Base
	belongs_to :trip_point
	belongs_to :trip
	belongs_to :user
	validates :trip_point, :presence=>true
end
