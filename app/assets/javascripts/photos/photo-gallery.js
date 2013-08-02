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
			target.addClass('labelClicked').removeClass('labelUnclicked');
			var location_id=target.data('location_id');
			if(location_id)
				$('#photo_container').find('li:[data-loction_id!='+location_id+']').hide().end().find('li:[data-location_id='+location_id+']').show();
			else
				$('#photo_container li').show();
	})
}