class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      
      t.string :email, :null=>false
      t.string :crypted_password, :null=>false
      t.string :password_salt, :null=>false
      t.string :persistence_token, :null=>false
      t.string :single_access_token, :null=>false
      t.string :perishable_token, :null=>false

      t.string :username, :null=>false

      t.integer :login_count, :null=>false,:default=>0
      t.datetime :current_login_at
      t.datetime :last_login_at

      t.timestamps
    end
  end
end
