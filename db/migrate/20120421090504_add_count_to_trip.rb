class AddCountToTrip < ActiveRecord::Migration
  def change
    add_column :trips, :count, :integer, :default=>0
  end
end
