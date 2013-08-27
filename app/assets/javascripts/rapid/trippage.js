var editTrip=function(){
	$('.travel-item').hover(function(){
		if($('.visible-img').css('display')=='block'){
			$(this).find('#journalEditor').css('visibility','hidden');
		}
	},function(){
		$(this).find('#journalEditor').css('visibility','visible');
	});

};