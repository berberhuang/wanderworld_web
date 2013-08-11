class Photo < ActiveRecord::Base
	belongs_to :trip
	belongs_to :user
	belongs_to :place
	attr_accessible :img ,:trip_id, :user_id, :place_id
	has_attached_file :img ,
	:url=>':s3_domain_url',
	:path => "photos/:photos_trip_id/:style/:hash_filename.:extension",
	:storage=>:s3,
	:bucket=>'wwonline-photo',
	:styles=>{:thumb=>["200x200>", :jpg],:large=>["1917x1917>",:jpg]},
	:source_file_options=>{:all=>'-auto-orient'}
	

	validates_attachment_presence :img
	validates_attachment_content_type :img, :content_type=>['image/jpeg','image/png']	




	def to_jq_upload
		{
		"name" => read_attribute(:img_file_name).gsub(/[\s\\\/:!\?\"<>|#_\-^+=\*]/,''),
		"size" => read_attribute(:img_file_size),
		"url" => img.url(:thumb),
		"original"=>img.url(:large),
		"id"=>id
		}
	end
end
