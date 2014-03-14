class AddAttachmentImgToPhotos < ActiveRecord::Migration
  def self.up
    change_table :photos do |t|
      t.attachment :img
    end
  end

  def self.down
    drop_attached_file :photos, :img
  end
end
