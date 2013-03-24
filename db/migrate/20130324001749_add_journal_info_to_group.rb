class AddJournalInfoToGroup < ActiveRecord::Migration
  def change
    add_column :groups, :count, :integer
    add_column :groups, :photo, :string
  end
end
