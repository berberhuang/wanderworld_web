/*var index=2;
function addBox(){
	var tt=$('#protoBox').clone().show().removeAttr('id').appendTo($('#input'));
	tt.val(index);
	tt.find('input').keydown(function(event){if(event.keyCode==13)addTripPoint($(event.target).parent().val());});
	tt.find('a').click(function(event){addTripPoint($(event.target).parent().val());});
	$('.place').autocomplete({source:'/place/search'});
	var t_height=$('.scroll-pane ul').height();
	if(t_height<300){
		$('.scroll-pane').animate({height:t_height+35},500,function(){
			$('.scroll-pane').jScrollPane();
		});
		$('.list').animate({height:t_height+320},500);
	}else
		$('.scroll-pane').jScrollPane();
	index++;
}
function addTripPoint(t){
	addItem(t,$('.place')[t].value);
}*/
