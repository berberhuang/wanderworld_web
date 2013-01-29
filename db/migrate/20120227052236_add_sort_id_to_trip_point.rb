class AddSortIdToTripPoint < ActiveRecord::Migration
  def change
    add_column :trip_points, :sort_id, :float
  end
end
