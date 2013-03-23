class User < ActiveRecord::Base
	has_many :trips, :dependent =>:destroy
    has_many :trip_points, :through => :trips
    has_many :journey, :through => :trip_points
    has_many :checkin_points, :through=>:trip_points
    has_many :place, :through => :trip_points
	has_many :micropost, :through=>:trip_points
	has_many :full_post, :through=>:trip_points	
	has_many :groups,:through=>:trips

	acts_as_authentic do |c|
		c.login_field = :email
	end

end
