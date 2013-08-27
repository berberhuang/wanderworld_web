var editTrip=function(){
	var target=$('.travel-item');
	target.hover(function(){
		$(this).find('.journalEditor').fadeIn(100);
	},function(){
		$(this).find('.journalEditor').fadeOut(100);
	});
};