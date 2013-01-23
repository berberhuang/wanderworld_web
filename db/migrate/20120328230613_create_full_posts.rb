class CreateFullPosts < ActiveRecord::Migration
  def change
    create_table :full_posts do |t|
      t.references  :user,:null=>false
      t.references  :trip,:null=>false
      t.references :trip_point,:null=>false
      t.text  :article,:null=>false

      t.timestamps
    end
  end
end
