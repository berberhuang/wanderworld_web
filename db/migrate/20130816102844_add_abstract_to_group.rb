class AddAbstractToGroup < ActiveRecord::Migration
  def change
    add_column :groups, :abstract, :string
  end
end
