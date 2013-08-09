/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	var imageDialog = function( editor, dialogType ) {
			var moduleInstance;
			// Load image preview.
			var IMAGE = 1,
				LINK = 2,
				PREVIEW = 4,
				CLEANUP = 8,
				regexGetSize = /^\s*(\d+)((px)|\%)?\s*$/i,
				regexGetSizeOrEmpty = /(^\s*(\d+)((px)|\%)?\s*$)|^$/i,
				pxLengthRegex = /^\d+px$/;
			var insertType;
			
			var fb_selector;
			var isFBLogin=false;
			
			var accessToken=null;

			var needReloadAlbum=true;
			
			var filter=/[\s\\\/:!\?\"<>|#_+\-=^\*]/g;

			var showAlbum=function(obj,datas){
				var ul=obj.find('.img_plugin_albums ul');
				ul.empty();
				for(var i=0;i<datas.length;i++){
					var data=datas[i];
					var src="https://graph.facebook.com/"+data.object_id+"/picture?type=album&access_token="+accessToken;
					$('<li data-id="'+data.object_id+'"><div class="image_border"><div class="image_self"><img src="'+src+'" /></div></div><div class="album_name">'+data.name+'</div></li>').appendTo(ul)
						.click(function(event){
							var albumId=$(event.target).parents('li').data('id');
							FB.api('/'+ albumId +'/photos?fields=id,picture,source,height,width&limit=1500', function(response){
								if(response.data){
									showPhoto(obj,response.data);
								}								
							});
						});
				}
			};

			var showPhoto=function(obj,datas){
				var return_btn=obj.find('.img_plugin_return');
				var album=obj.find('.img_plugin_albums');
				var preview=obj.find('.img_plugin_other_preview');
				var ul=preview.find('ul');
				return_btn.unbind('click').click(function(){
					album.show();
					return_btn.hide();
					preview.hide();
				});
				album.hide();
				return_btn.show();
				preview.show();
				ul.empty();
				for(var i=0;i<datas.length;i++){
					data=datas[i];
					var imgObj=$('<li class="img_plugin_unselected"><img src="'+data.picture+'" data-src="'+data.source+'"/></li>').appendTo(preview.find('ul'))
						.click(function(event){
							var tmp=$(event.target).parents('li');
							if(tmp.hasClass('img_plugin_unselected')){
								tmp.removeClass('img_plugin_unselected')
								.addClass('img_plugin_selected');
							}else{
								tmp.removeClass('img_plugin_selected')
								.addClass('img_plugin_unselected');
							}
						});
				}
			};
			
			var loadFBAlbum=function(obj){
				FB.getLoginStatus(function(response) {
					if (response.status === 'connected') {
						accessToken = response.authResponse.accessToken;
						var id=FB.getUserID();
						// Load Facebook photos
						//FB.api('/'+ id +'/albums', function(response) {
						FB.api('fql',{q:'SELECT name,object_id FROM album WHERE owner='+id+' order by created DESC limit 500'}, function(response) {
							if (response.data.length) {
								showAlbum(obj,response.data);

								if (typeof callback === 'function') { callback(); }
							} else {
								alert ('Sorry, your friend won\'t let us look through their photos');
								log('CSPhotoSelector - buildAlbumSelector - No albums returned');
								return false;
							}
						});
					} else {
						log('image plugin-User is not logged in to Facebook');
						return false;
					}
				});
			};
			

			var attachFileUploadListener=function(file_selector,preview_ul){
				var fileIndex=0;
				var place_id=tripPointItemManager.getPlaceIdByTripPointId(contentBox.getEditTripPointId());
				file_selector.fileupload({
					datatype: 'json',
					autoUpload: true,
					dropZone:preview_ul,
					formData:{'photo[trip_id]':DataStatus.trip_id,'photo[trip_point_id]':place_id,'photo[place_id]':place_id},
					acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
					disableImageResize: /Android(?!.*Chrome)|Opera/
						.test(window.navigator && navigator.userAgent)
				}).bind('fileuploadadd',function(e,data){
					var name=data.files[0].name.replace(filter,'');
					var imgObj=$('<li data-filename="'+name+'" class="img_plugin_selected"><img src=""/><div class="img_plugin_progress_bar"><div></div></div></li>');
					needReloadAlbum=true;
					imgObj.appendTo(preview_ul)
						.click(function(event){
							var tmp=$(event.target).parents('li');
							if(tmp.hasClass('img_plugin_unselected')){
								tmp.removeClass('img_plugin_unselected')
									.addClass('img_plugin_selected');
							}else{
								tmp.removeClass('img_plugin_selected')
									.addClass('img_plugin_unselected');
							}
						});

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


			var getAlbum=function(preview){
				
				var loadPhotoToAlbumContainer=function(result){
					var ul=preview.find('ul');
					ul.empty();	
					for(var i=0;i<result.length;i++){
						data=result[i];
						var imgObj=$('<li class="img_plugin_unselected" data-id="'+data.id+'"><img src="'+data.picture+'" data-src="'+data.source+'" /></li>').appendTo(ul)
							.click(function(event){
								var tmp=$(event.target).parents('li');
								if(tmp.hasClass('img_plugin_unselected')){
									tmp.removeClass('img_plugin_unselected')
									.addClass('img_plugin_selected');
								}else{
									tmp.removeClass('img_plugin_selected')
									.addClass('img_plugin_unselected');
								}
							});
					}
				};
				
				$.get('/photos/album/'+DataStatus.trip_id,null,loadPhotoToAlbumContainer,'json');
			};

			
			return {
				title: editor.lang.image[ dialogType == 'image' ? 'title' : 'titleButton' ],
				minWidth: 680,
				minHeight: 400,
				onShow: function() {
					this.insertType='url';
					$(this.getContentElement('url','preview').getElement().$).find('ul').empty();
					$(this.getContentElement('upload','preview').getElement().$).find('ul').empty();

				},

				onOk: function() {
					var selected=[];
					if(this.insertType=='url'){
						selected=$(this.getContentElement('url','preview').getElement().$).find('.img_plugin_selected');
						for(var i=0;i<selected.length;i++){
							editor.insertHtml(selected.eq(i).find('img').attr('width','75%').end().html())
						}
						
					}else if(this.insertType=='upload'){
						selected=$(this.getContentElement('upload','preview').getElement().$).find('.img_plugin_selected');
						for(var i=0;i<selected.length;i++){
							editor.insertHtml('<img src="'+selected.eq(i).find('img').data('src')+'" width="75%" />');
						}
					}else if(this.insertType=='album'){
						selected=$(this.getContentElement('album','preview').getElement().$).find('.img_plugin_selected');
						for(var i=0;i<selected.length;i++){
							editor.insertHtml('<img src="'+selected.eq(i).find('img').data('src')+'" width="75%" />');
							var photo_id=selected.eq(i).data('id');
							var place_id=tripPointItemManager.getPlaceIdByTripPointId(contentBox.getEditTripPointId());
							$.post('/photos/setLocation',{id:photo_id,place_id:place_id});
						}

					}else if(this.insertType=='other'){
						selected=$(this.getContentElement('other','preview').getElement().$).find('.img_plugin_selected');
						for(var i=0;i<selected.length;i++){
							editor.insertHtml('<img src="'+selected.eq(i).find('img').data('src')+'" width="75%" />');
						}
					}
					
					var preview=$(this.getContentElement('album','preview').getElement().$);
					preview.find('.img_plugin_selected').removeClass('img_plugin_selected').addClass('img_plugin_unselected');
				},
				onLoad: function() {
					this.on('selectPage',function(event){
						this.insertType=event.data.page;
						if(this.insertType=='album'){
							if(needReloadAlbum){
								var preview=$(this.getContentElement('album','preview').getElement().$);
								getAlbum(preview);
								needReloadAlbum=false;
							}
						}						
					});
					var preview=$(this.getContentElement('upload','preview').getElement().$);
					
					var file_selector=preview.find('#fileupload');
					var drag_area=preview.find('.img_plugin_file_drag ul');
					attachFileUploadListener(file_selector,drag_area);
				
					
				},
				onHide: function() {
				},
				
				contents: [
					{
					id: 'url',
					label: '照片URL',
					elements: [
							{
							type: 'hbox',
							widths: [ '280px', '110px' ],
							align: 'right',
							children: [
								{
								id: 'txtUrl',
								type: 'text',
								label: editor.lang.common.url,
								required: true,
								onChange: function() {
									var dialog = this.getDialog(),
									    newUrl = this.getValue();

									//Update original image
									if ( newUrl.length > 0 ) //Prevent from load before onShow
									{
										dialog = this.getDialog();
										
										var preview=$(dialog.getContentElement('url','preview').getElement().$);
										
										var imgObj=$('<li class="img_plugin_selected"><img src="'+newUrl+'"/></li>').appendTo(preview.find('ul'))
											.click(function(event){
												var tmp=$(event.target).parents('li');
													if(tmp.hasClass('img_plugin_unselected')){
														tmp.removeClass('img_plugin_unselected')
															.addClass('img_plugin_selected');
													}else{
														tmp.removeClass('img_plugin_selected')
															.addClass('img_plugin_unselected');
													}
											});
											
										var id=newUrl.match(/www\.facebook\.com\/photo\.php\?fbid=[0-9]*/);
										if(id){
											id=id[0].split('=')[1];
											previewPhotoFromFB(imgObj,id);
										}
										this.setValue('');
									}
									// Dont show preview if no URL given.
									else if ( dialog.preview ) {
										dialog.preview.removeAttribute( 'src' );
										dialog.preview.setStyle( 'display', 'none' );
									}
								}
								//validate: CKEDITOR.dialog.validate.notEmpty( editor.lang.image.urlMissing )
							}
							]
						},
							{
							type: 'hbox',
							widths: [ '280px', '110px' ],
							style: 'text-align:right;',
							children: [
								{
								id:'insert',
								style: 'text-align:right;',
								type:'button',
								label:'新增'
							}
							]
						},
							{
							id:'preview',
							type:'html',
							html:'<div class="img_plugin_preview"><ul></ul></div>'
						}	
						]
					
					
				},
					{
					id:'upload',
					label:'上傳',
					elements:[
						{
							id:'preview',
							type:'html',
								html:'<div>'+'<form id="fileupload" data-url="/photos/uploadPhoto" ><input type="file" name="photo[img]" multiple /></form>'+
'<div class="img_plugin_preview img_plugin_file_drag"><ul></ul></div>'+'</div>'
						}
					]
				},
					{
					id:'album',
					label:'相簿',
					elements:[
						{
							id:'preview',
							type:'html',
							html:'<div class="img_plugin_other_preview"><ul></ul></div>'
						}
					]
				},
					{
					id:'other',
					label:'其他網路相簿',
					elements:[
						{
						type: 'vbox',
						padding: 0,
						children: [
							{
							type: 'hbox',
							widths: [ '280px', '110px' ],
							align: 'left',
							children: [
								{
								type: 'button',
								id: 'fbSelector',
								style: 'display:block;width:80px;background-color:blue;color:white;',
								align: 'center',
								label: 'Facebook',
								onClick:function(){
									var obj=$(this.getDialog().getContentElement('other','preview').getElement().$);
									loadFBAlbum(obj);
								}
							}
							]
						},
							{
							id:'preview',
							type:'html',
							html:'<div><div class="img_plugin_albums"><ul></ul></div><a src="#" class="img_plugin_return" style="display:none">返回</a><div class="img_plugin_other_preview" style="display:none"><ul></ul></div></div>'
						}	
						]
					}
					]
					
				}
				]
			};
		};

	CKEDITOR.dialog.add( 'customimage', function( editor ) {
		return imageDialog( editor, 'customimage' );
	});

	CKEDITOR.dialog.add( 'imagebutton', function( editor ) {
		return imageDialog( editor, 'imagebutton' );
	});
})();

