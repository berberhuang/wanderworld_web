//hover到相簿title時出現返回icon

/*var showReturnAlbumList=function(){
	$('.album-title').mouseenter(function(){
		$('#return-album-list').show();
	}),
	$('.album-title').mouseleave(function(){
		$('#return-album-list').hide();
	})
}*/

//clicked 後有效果，並解決
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
	});
};

//hover相片出現編輯選項
var editPhoto=function(){
	$('#photo_container li').hover(function(){
		if($('.visible-img').css('display')=='block'){
			$(this).find('#photoEditor').css('visibility','hidden');
		}
	},function(){
		$(this).find('#photoEditor').css('visibility','visible');
	});

};

var deletePhoto=function(){
	$('.photo_delete_button').click(function(){
		var target=$(this).parents('li');
		var id=target.data('id');
		
		if(window.confirm('您確定要刪除?') == false){	
			return false;
		}	
		

		$.post('/photos/deletePhoto',{photo_id:id},function(result){
			if(result){
				target.animate({width:'0px'},500,function(){target.remove();});
			}
		});
	});
};
