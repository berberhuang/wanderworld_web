class AddSortIdToTripPoints < ActiveRecord::Migration
  def change
    add_column :trip_points, :sort_id, :integer
  end
end
