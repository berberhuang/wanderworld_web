var UploadPhotoModule=function(obj){
	var target=$(obj);
	var upload_button=target.find('#fileupload input');
	var preview_ul=target.find('.img_plugin_preview ul');
	var upload_compelete=target.find('#upload_compelete');
	
	var filter=/[\s\\\/:!\?\"<>|#_+\-=^\*]/g;
	
	var attachFileUploadListener=function(file_selector,preview_ul,trip_id){
		file_selector.fileupload({
			datatype: 'json',
			autoUpload: true,
			dropZone:preview_ul,
			formData:{'photo[trip_id]':trip_id},
			acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
			disableImageResize: /Android(?!.*Chrome)|Opera/
				.test(window.navigator && navigator.userAgent)
		}).bind('fileuploadadd',function(e,data){
			var name=data.files[0].name.replace(filter,'');
			var imgObj=$('<li data-filename="'+name+'" class="img_plugin_unselected"><img src=""/><div class="img_plugin_progress_bar"><div></div></div></li>');
			imgObj.appendTo(preview_ul);

		}).bind('fileuploaddone',function(e,data){	
			$.each(JSON.parse(data.result).files, function (index, file) {
				if(!index){
					var name=file.name;
					var imgObj=preview_ul.find('li:[data-filename="'+name+'"]');
					imgObj.find('img').attr('src',file.url).data('src',file.original).data('id',file.id);
					imgObj.find('.img_plugin_progress_bar').hide();
				}
			});

		}).bind('fileuploadprogress',function(e,data){
			$.each(data.files, function (index, file) {
				if(!index){
					var name=file.name.replace(filter,'');
					var imgObj=preview_ul.find('li:[data-filename="'+name+'"]');
					var bar=imgObj.find('.img_plugin_progress_bar div');
					bar.css('width',(data.loaded/data.total)*100 +'%');
				}
			});
		});
	};
		
	return {
		init:function(trip_id){
			attachFileUploadListener(upload_button,preview_ul,trip_id);
			upload_compelete.click(function(){
				location.reload();
			});
		}
	};
};