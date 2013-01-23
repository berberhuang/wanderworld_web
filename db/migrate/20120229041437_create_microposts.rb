class CreateMicroposts < ActiveRecord::Migration
  def change
    create_table :microposts do |t|
      t.references :user,:null=>false
      t.references :trip,:null=>false
      t.references :trip_point,:null=>false
      t.text :article,:null=>false

      t.timestamps
    end
  end
end
