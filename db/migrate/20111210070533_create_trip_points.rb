class CreateTripPoints < ActiveRecord::Migration
  def change
    create_table :trip_points do |t|
      t.string :name
      t.references :user,:null=>false
      t.references :trip,:null=>false
      t.references :place,:null=>false
      t.timestamps
    end
  end
end
