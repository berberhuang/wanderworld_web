class Photo < ActiveRecord::Base
	belongs_to :trip
	belongs_to :user
	belongs_to :place
	attr_accessible :img ,:trip_id, :user_id, :place_id
	has_attached_file :img ,
	:url=>':s3_domain_url',
	:path => "photos/:photos_trip_id/:style/:id:basename.:extension",
	:storage=>:s3,
	:bucket=>'wwtest-photo',
	:styles=>{:thumb=>"200x200",:original=>"1917x1917"},
	:source_file_options=>{:all=>'-auto-orient'}
	

	validates_attachment_presence :img
	validates_attachment_content_type :img, :content_type=>['image/jpeg','image/png']	




	def to_jq_upload
		{
		"name" => read_attribute(:img_file_name),
		"size" => read_attribute(:img_file_size),
		"url" => img.url(:thumb),
		"original"=>img.url(:original),
		"id"=>id
		#"delete_url" => file.path(self),
		#"delete_type" => "DELETE" 
		}
	end
end
