class AddGroupIdToTripPoint < ActiveRecord::Migration
  def change
    add_column :trip_points, :group_id, :integer
  end
end
