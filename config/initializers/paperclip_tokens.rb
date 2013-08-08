Paperclip.interpolates :photos_trip_id do |attachment, style|
	attachment.instance.trip_id
end

Paperclip.interpolates :hash_filename do |attachment, style|
	 Digest::MD5.hexdigest(attachment.instance.img_file_name+attachment.instance.id.to_s)
end
