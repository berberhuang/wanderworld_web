class CreateJourneys < ActiveRecord::Migration
  def change
    create_table :journeys do |t|
      t.references :user
      t.references :trip
      t.references :trip_point
      t.string :title
      t.text :article
      t.timestamps
    end
  end
end
