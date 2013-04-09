# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130325034723) do

  create_table "checkin_points", :force => true do |t|
    t.integer  "user_id"
    t.integer  "trip_id"
    t.integer  "trip_point_id"
    t.string   "label"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", :force => true do |t|
    t.integer  "user_id"
    t.integer  "group_id"
    t.integer  "commentGroup_id"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "full_posts", :force => true do |t|
    t.integer  "user_id",       :null => false
    t.integer  "trip_id",       :null => false
    t.integer  "trip_point_id", :null => false
    t.text     "article",       :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups", :force => true do |t|
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "trip_id"
    t.boolean  "public"
    t.float    "sort_id"
    t.integer  "user_id"
    t.integer  "count"
    t.string   "photo"
  end

  create_table "journeys", :force => true do |t|
    t.integer  "user_id"
    t.integer  "trip_id"
    t.integer  "trip_point_id"
    t.string   "title"
    t.text     "article"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "microposts", :force => true do |t|
    t.integer  "user_id",       :null => false
    t.integer  "trip_id",       :null => false
    t.integer  "trip_point_id", :null => false
    t.text     "article",       :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "places", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "longitude"
    t.float    "latitude"
    t.string   "city"
  end

  create_table "trip_points", :force => true do |t|
    t.integer  "user_id",    :null => false
    t.integer  "trip_id",    :null => false
    t.integer  "place_id",   :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "sort_id"
    t.integer  "group_id"
  end

  create_table "trips", :force => true do |t|
    t.integer  "user_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.date     "start_date"
    t.date     "end_date"
    t.integer  "count",      :default => 0
  end

  create_table "users", :force => true do |t|
    t.string   "email",                              :null => false
    t.string   "crypted_password",                   :null => false
    t.string   "password_salt",                      :null => false
    t.string   "persistence_token",                  :null => false
    t.string   "single_access_token",                :null => false
    t.string   "perishable_token",                   :null => false
    t.string   "username",                           :null => false
    t.integer  "login_count",         :default => 0, :null => false
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "fbid"
  end

end
