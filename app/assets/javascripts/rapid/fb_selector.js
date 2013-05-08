
/*globals $, jQuery, CSPhotoSelector */

var showFbPhotoSelector;

$(document).ready(function () {
	var selector, logActivity, callbackAlbumSelected, callbackPhotoUnselected, callbackSubmit;
	var buttonOK = $('#CSPhotoSelector_buttonOK');
	var o = this;
	var isLogin=false;
	
	/* --------------------------------------------------------------------
	 * Photo selector functions
	 * ----------------------------------------------------------------- */
	
	fbphotoSelect = function(id,afterSubmit) {
		// if no user/friend id is sent, default to current user
		if (!id){
			if(UserData.facebook_id){
				id=UserData.facebook_id;
			}else{ 
				FB.api('me',function(r){
					id =r.id
				
					// reset and show album selector
					selector.reset();
					selector.showAlbumSelector(id);
				});
			}
		}
		
		
		callbackAlbumSelected = function(albumId) {
			var album, name;
			album = CSPhotoSelector.getAlbumById(albumId);
			// show album photos
			selector.showPhotoSelector(null, album.id);
		};

		callbackAlbumUnselected = function(albumId) {
			var album, name;
			album = CSPhotoSelector.getAlbumById(albumId);
		};

		callbackPhotoSelected = function(photoId) {
			var photo;
			photo = CSPhotoSelector.getPhotoById(photoId);
			buttonOK.show();
		};

		callbackPhotoUnselected = function(photoId) {
			var photo;
			album = CSPhotoSelector.getPhotoById(photoId);
			buttonOK.hide();
		};

		
		callbackSubmit = function(photoId) {
			var photo;
			photo = CSPhotoSelector.getPhotoById(photoId);
			if(afterSubmit){
				afterSubmit(photo.source);
			}
		};
		

		// Initialise the Photo Selector with options that will apply to all instances
		CSPhotoSelector.init({debug: true});

		// Create Photo Selector instances
		selector = CSPhotoSelector.newInstance({
			callbackAlbumSelected	: callbackAlbumSelected,
			callbackAlbumUnselected	: callbackAlbumUnselected,
			callbackPhotoSelected	: callbackPhotoSelected,
			callbackPhotoUnselected	: callbackPhotoUnselected,
			callbackSubmit			: callbackSubmit,
			maxSelection			: 1,
			albumsPerPage			: 6,
			photosPerPage			: 200,
			autoDeselection			: true
		});

		if(UserData.facebook_id){
			// reset and show album selector
			selector.reset();
			selector.showAlbumSelector(id);
		}

	}
	
	
	/* --------------------------------------------------------------------
	 * Click events
	 * ----------------------------------------------------------------- */
/*	
	$("#btnLogin").click(function (e) {
		e.preventDefault();
		FB.login(function (response) {
			if (response.authResponse) {
				$("#login-status").html("Logged in");
			} else {
				$("#login-status").html("Not logged in");
			}
		}, {scope:'user_photos, friends_photos'});
	});
	
	$("#btnLogout").click(function (e) {
		e.preventDefault();
		FB.logout();
		$("#login-status").html("Not logged in");
	});
	
	$(".photoSelect").click(function (e) {
		if(!isLogin){
			FB.login(function (response) {
				if (response.authResponse) {
					e.preventDefault();
					id = null;
					if ( $(this).attr('data-id') ) id = $(this).attr('data-id');
					fbphotoSelect(id);
					isLogin=true;
				} else {
					return;
				}
			}, {scope:'user_photos'});
		}else{
			e.preventDefault();
			id = null;
			if ( $(this).attr('data-id') ) id = $(this).attr('data-id');
			fbphotoSelect(id);
		}
	});
*/
});
