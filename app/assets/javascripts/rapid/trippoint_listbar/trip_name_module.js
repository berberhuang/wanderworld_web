var TripNameModule = function(obj){
		var target = obj;
		
		var tripNameDOM;
		
		var tripNameLabel;
		var tripNameInput;

		var tripNameDivStr='<div class="row word-break" id="trip_name_editDiv" style="pointer:cursor;"><h4><a></a></h4></div>';
		var tripNameInputStr='<input class="row" id="trip_name_input" style="display:none;" placeholder="輸入旅行名稱" />';
		
		//按下編輯旅行名稱(click)
		var clickEditTripName=function(){
			trip_name=getTripNameInLabel();
			tripNameLabel.hide();
			tripNameInput.show().focus().val(trip_name);
			
			setClickOutsideEvent(tripNameInput,finishEditTripName);
		};
		
		var finishEditTripName=function(){
			var label = getTripNameInLabel();
			var input = getTripNameInInput();
			if( isStringNull(label) && isStringNull(input) ){ 
				setTripNameLabel("請輸入旅行名稱");
				tripNameLabel.attr('title'," 請輸入旅行名稱");
			}else{
				var name=(!isStringNull(input)) ? input : label;
				setTripNameLabel( name );
				tripNameLabel.attr('title',name);
			}
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
		
		var getTripNameInLabel=function(){
			return tripNameLabel.find('a').text();
		};
		
		var getTripNameInInput=function(){
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
				if(tripNameDOM.find('#trip_name_editDiv').length==0)
					tripNameLabel=$(tripNameDivStr).appendTo(tripNameDOM);
				else
					tripNameLabel=tripNameDOM.find('#trip_name_editDiv');
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