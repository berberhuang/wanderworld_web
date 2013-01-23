class RemoveWrongSortIdFromTripPoints < ActiveRecord::Migration
  def up
    remove_column :trip_points, :sort_id
  end

  def down
    add_column :trip_points, :sort_id, :number
  end
end
