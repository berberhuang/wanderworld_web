class AddPosToTripPoints < ActiveRecord::Migration
  def change
    add_column :trip_points, :longitude, :float
    add_column :trip_points, :latitude, :float
  end
end
