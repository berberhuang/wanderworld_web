Paperclip.interpolates :photos_trip_id do |attachment, style|
	attachment.instance.trip_id
end

Paperclip.interpolates :hash_filename do |attachment, style|
	 Digest::MD5.hexdigest(attachment.instance.trip_id.to_s+attachment.instance.id.to_s)
end
