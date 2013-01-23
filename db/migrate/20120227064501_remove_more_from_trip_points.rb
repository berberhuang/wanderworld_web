class RemoveMoreFromTripPoints < ActiveRecord::Migration
  def up
    remove_column :trip_points, :name
    remove_column :trip_points, :longitude
    remove_column :trip_points, :latitude
    remove_column :trip_points, :city
  end

  def down
    add_column :trip_points, :city, :string
    add_column :trip_points, :latitude, :number
    add_column :trip_points, :longitude, :number
    add_column :trip_points, :name, :string
  end
end
