/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	var imageDialog = function( editor, dialogType ) {
			// Load image preview.
			var IMAGE = 1,
				LINK = 2,
				PREVIEW = 4,
				CLEANUP = 8,
				regexGetSize = /^\s*(\d+)((px)|\%)?\s*$/i,
				regexGetSizeOrEmpty = /(^\s*(\d+)((px)|\%)?\s*$)|^$/i,
				pxLengthRegex = /^\d+px$/;
			
			
			
			var target=null;
			
			return {
				title: editor.lang.image[ dialogType == 'image' ? 'title' : 'titleButton' ],
				minWidth: 150,
				minHeight: 75,
				onShow: function() {
					target=$(this.getSelectedElement().$);
					var content=$(this.getContentElement('page','edit').getElement().$);
					var size=target.attr('width');

					switch(size){
						case '100%':
							content.find('input:[value=l]').attr('checked',true);
							break;
						case '75%':
							content.find('input:[value=m]').attr('checked',true);
							break;
						case '50%':
							content.find('input:[value=s]').attr('checked',true);
							break;
						default:
							content.find('input:[value=m]').attr('checked',true);
						
					};
				},
				onOk: function() {
					var content=$(this.getContentElement('page','edit').getElement().$);
					var size=content.find('input:[name=size][checked]').val();
					switch(size){
						case 'l':
							//target.css('min-width','100%');
							target.attr('width','100%');
							break;
						case 'm':
							//target.css('min-width','75%');
							target.attr('width','75%');
							break;
						case 's':
							//target.css('min-width','50%');
							target.attr('width','50%');
							break;
					}
					/*
					var degree=content.find('#degree').val();
					target.css({
						'transform':'rotate('+degree+')',
						'-ms-transform':'rotate('+degree+'deg)',
						'-webkit-transform':'rotate('+degree+'deg)'
					});
					*/
				},
				onLoad: function() {
					
				},
				onHide: function() {
				},
				
				contents: [
					{
					id:'page',
					type:'vbox',
					elements:[
						{
						id:'edit',
						type:'html',
						//html:'<div><div>圖片尺寸:大<input type="radio" name="size" value="l" />中 <input type="radio" name="size" value="m" />小 <input type="radio" name="size" value="s" /> </div><div>圖片方向:<input id="degree" type="number" value="0" style="width:60px"/>度</div></div>'
						html:'<div><div>圖片尺寸:<input type="radio" name="size" value="l" style="margin-left:10px" />大 <input type="radio" name="size" value="m" style="margin-left:10px" />中 <input type="radio" name="size" value="s" style="margin-left:10px" />小 </div></div>'
					}
					]
				}
				]
			};
		};

	CKEDITOR.dialog.add( 'editimage', function( editor ) {
		return imageDialog( editor, 'editimage' );
	});

	//CKEDITOR.dialog.add( 'imagebutton', function( editor ) {
	//	return imageDialog( editor, 'imagebutton' );
	//});
})();

