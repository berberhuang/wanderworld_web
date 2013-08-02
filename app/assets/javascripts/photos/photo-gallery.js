//hover到相簿title時出現返回icon

/*var showReturnAlbumList=function(){
	$('.album-title').mouseenter(function(){
		$('#return-album-list').show();
	}),
	$('.album-title').mouseleave(function(){
		$('#return-album-list').hide();
	})
}*/

//clicked 後有效果
var locationLabel=function(){
	var picker=$('.location-picker');
	picker.find('li').click(function(){
			picker.find('.labelClicked').removeClass('labelClicked').addClass('labelUnclicked');
			var target=$(this);
			var hideBlock=$('#none');
			target.addClass('labelClicked').removeClass('labelUnclicked');
			var location_id=target.data('location_id');
			var photoContainer=$('#photo_container');
			if(location_id){
				photoContainer.find('li:[data-location_id!='+location_id+']').appendTo(hideBlock);
				hideBlock.find('li:[data-location_id='+location_id+']').appendTo(photoContainer);
			}else{
				hideBlock.find('li').appendTo(photoContainer);
			}
	})
}