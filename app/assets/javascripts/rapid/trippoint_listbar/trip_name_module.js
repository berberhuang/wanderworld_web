var TripNameModule = function(obj){
		var target = obj;
		
		var tripNameDOM;
		
		var tripNameLabel;
		var tripNameInput;

		var tripNameDivStr='<div><a></a></div>';
		var tripNameInputStr='<input id="trip_name_input" style="display:none;" placeholder="輸入旅行名稱" />';
		
		//按下編輯旅行名稱(click)
		var clickEditTripName=function(){
			trip_name=$('#trip_name a:eq(0)').text();
			$('#trip_name div').hide().parent().find('input').show().focus().val(trip_name);
			
			setClickOutsideEvent(tripNameInput,finishEditTripName);
		};
		
		var finishEditTripName=function(){
			var label = getTripNameLabel();
			var input = getTripNameInput();
			if( isStringNull(label) && isStringNull(input) ) 
				setTripNameLabel("請輸入旅行名稱");
			else
				setTripNameLabel( (!isStringNull(input)) ? input : label );
			finishEdit();
			
			Data.saveTripName();
		};
		
		//完成編輯旅行名稱按下enter(keydown)
		var keydownEditTripName=function(event){
			if(event.keyCode==13){
				finishEditTripName();
				reLayout();
			}
		};
		
		var enableEdit=function(){
			tripNameLabel.unbind('click').click(function(){clickEditTripName();});
			tripNameLabel.css('cursor','pointer');
		};
		
		var disableEdit=function(){
			tripNameLabel.unbind('click');
			tripNameLabel.css('cursor','auto');
		};
		
		var getTripNameLabel=function(){
			return tripNameLabel.find('a').text();
		};
		
		var getTripNameInput=function(){
			return tripNameInput.val();
		};
		var setTripNameLabel=function(str){
			tripNameLabel.find('a').text(str);
		};
		
		var setTripNameInput=function(str){
			tripNameInput.val(str);
		};

		var initTripNameLabel=function(){
			if(!tripNameLabel){
				if(tripNameDOM.find('div').length==0)
					tripNameLabel=$(tripNameDivStr).appendTo(tripNameDOM);
				else
					tripNameLabel=tripNameDOM.find('div:eq(0)');
			}
		};
		
		var initTripNameInput=function(){
			if(!tripNameInput){
				tripNameInput=$(tripNameInputStr).appendTo(tripNameDOM).keydown(keydownEditTripName);
			}
		};
		
		var finishEdit=function(){
			tripNameLabel.show();
			tripNameInput.hide();		
			tripNameInput.unbind('clickoutside');
		};
		
		
		return {
			init:function(){
				tripNameDOM=target.find('#trip_name');
				initTripNameLabel();
				initTripNameInput();
			},
			refresh:function(){
				setTripNameLabel(DataStatus.trip_name);
			},
			ownerModeSwitch:function(permission){
				if(permission)
					enableEdit();
				else
					disableEdit();
			}
			
		};
};