class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.integer :user_id
      t.integer :trip_id
      t.integer :place_id

      t.timestamps
    end
  end
end
