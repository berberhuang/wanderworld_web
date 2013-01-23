class AddPosToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :longitude, :float
    add_column :places, :latitude, :float
  end
end
