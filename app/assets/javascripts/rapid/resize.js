(function($){
	$.fn.resize_by_drag=function(str){
		var patten='<div class="panel" style="display:inline">'+
						'<div id="leftTop" class="controlPoint"></div>'+
						'<div id="rightBottom" class="controlPoint"></div>'+
					'</div>';		
		return this.each(function(){
			var target=$(this);
			var p;
			var rightBottom;
			var leftTop;
			var rb_top,rb_left;
			var lt_top,lt_left;
			var doc=$('body');
			var scale=target.width()/target.height();
			
			switch(str){
			case 'destroy':
				target.removeClass('resize_by_drag');
				p=target.parents('.panel');
				if(!p){
					return;
				}
				
				target.insertBefore(p);
				p.remove();
				return;
				break;
			};
			p=$(patten);
			rightBottom=p.find('#rightBottom');
			leftTop=p.find('#leftTop');		

			target.addClass('resize_by_drag');
			p.insertBefore(target);

			rb_top=target.offset().top+target.height() - rightBottom.height();
			rb_left=target.offset().left + target.width() - rightBottom.width() ;
			
			lt_top=target.offset().top;
			lt_left=target.offset().left;						

			target.appendTo(p);
			
			rightBottom.offset({top:rb_top,left:rb_left});
			leftTop.offset({top:lt_top,left:lt_left});
			
			rightBottom.mousedown(function(event){
				doc.mousemove(function(event){
					var width=event.pageX-target.offset().left;
					var height=event.pageY-target.offset().top;					

					if(width/height<scale){
						width=height*scale;
					}else{
						height=width/scale;
					}

					if(width<0)width=-width;
					if(height<0)height=-height;
					rightBottom.offset({top:target.offset().top-rightBottom.height()+height,left:target.offset().left-rightBottom.width()+width});
					leftTop.offset({top:target.offset().top,left:target.offset().left});
					
					target.width(width);
					target.height(height);
				});
				doc.mouseup(function(event){
					doc.unbind('mousemove').unbind('mouseup');
				});
			});

			leftTop.mousedown(function(event){
				doc.mousemove(function(event){
					var width=target.offset().left+target.width()-event.pageX;
					var height= target.offset().top+target.height()-event.pageY;
					
					if(width/height<scale){
						width=height*scale;
					}else{
						height=width/scale;
					}
					if(width<0)width=-width;
					if(height<0)height=-height;
					
					target.width(width);
					target.height(height);
					rightBottom.offset({top:target.offset().top-rightBottom.height()+height,left:target.offset().left-rightBottom.width()+width});
					leftTop.offset({top:target.offset().top,left:target.offset().left});
				});
				doc.mouseup(function(event){
					doc.unbind('mousemove').unbind('mouseup');
				});
			});
		});
	};
}(jQuery));
