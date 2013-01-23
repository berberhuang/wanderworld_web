class CreateCheckinPoints < ActiveRecord::Migration
  def change
    create_table :checkin_points do |t|
      t.references :user
      t.references :trip
      t.references :trip_point
      t.string :label
      t.timestamps
    end
  end
end
