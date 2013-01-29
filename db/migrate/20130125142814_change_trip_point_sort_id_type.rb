class ChangeTripPointSortIdType < ActiveRecord::Migration
  def up
	#add_column :trip_points, :n_sort_id, :float
	change_column :trip_points, :sort_id, :float
	change_column :groups, :sort_id, :float
  end

  def down
  end
end
