class AddSortIdToGroups < ActiveRecord::Migration
  def change
	add_column :groups, :sort_id, :float
  end
end
