class AddCityToTripPoint < ActiveRecord::Migration
  def change
    add_column :trip_points, :city, :string
  end
end
