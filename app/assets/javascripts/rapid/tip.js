var TipModule=function(){
	var target;
	
	var end=function(){
		target.foundation('joyride','end');
	};

	var show=function(i){
		target.foundation('joyride', 'start',{startOffset:i,
						     postRideCallback:end});
	};
	
	var hide=function(){
		target.foundation('joyride', 'end');
	};
	
	return {
		show:function(i){
			if(target){
				hide();
				show(i);
			}
		},
		hide:function(){
			if(target){
				hide();
			}
		},
		disable:function(){
			target=false;
		},
		enable:function(obj){
			target=obj;
		}
	};
};
