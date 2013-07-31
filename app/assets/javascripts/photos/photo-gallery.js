//hover到相簿title時出現返回icon

var showReturnAlbumList=function(){
	$('.album-title').mouseenter(function(){
		$('#return-album-list').show();
	}),
	$('.album-title').mouseleave(function(){
		$('#return-album-list').hide();
	})
}