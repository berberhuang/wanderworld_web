var TripDateModule = function(obj){
	var target = obj;
	
	var tripDateDOM;
	var tripDateLabel;
	var tripDateInput;
	
	var tripDateDivStr='<div><a></a></div>';
	var tripDateInputStr='<input id="date_picker" type="text" readonly="readonly" style="display:none;" />';

	
	var tripStatusInstance = new TripStatusModule(target);
	
	
	
	//按下編輯旅行日期(click)
	var clickEditTripDate=function(){
		var trip_date=getTripDateLabel();
		tripDateLabel.hide();
		setTripDateInput(trip_date);
		tripDateInput.show().focus();
			
		
		
		setClickOutsideEvent(tripDateInput,finishEditTripDate);
		setTimeout(function(){
					tripDateInput.click();
		},100);
	};
	
	var finishEditTripDate=function(){
		var label = getTripDateLabel();
		var input = getTripDateInput();
		var result = (!isStringNull(input)) ? input : label;
		
		setTripDateLabel(result);
		finishEdit();
		
		//tripStatusInstance.updateTripStatus( result );
		Data.saveTripDate();
	};
	
	//編輯日期按下完成(click)
	var keydownEditTripDate=function(){
		finishEditTripDate();
	};
	
	var enableEdit=function(){
		tripDateLabel.unbind('click').click(clickEditTripDate);
		tripDateLabel.css('cursor','pointer');
	};
	
	var disableEdit=function(){
		tripDateLabel.unbind('click');
		tripDateLabel.css('cursor','auto');
	};
	
	var getTripDateLabel=function(){
		return tripDateLabel.find('a').text();
	};
	
	var getTripDateInput=function(){
		return tripDateInput.val();
	};
	
	var setTripDateLabel=function(str){
		tripDateLabel.find('a').text(str);
	};
	
	var setTripDateInput=function(str){
		tripDateInput.val(str);
	};
	
	var initTripDateLabel=function(){
		if(!tripDateLabel){
			if(tripDateDOM.find('div').length==0){
				tripDateLabel = $(tripDateDivStr).appendTo(tripDateDOM);
			}else{
				tripDateLabel = target.find('#trip_date div:eq(0)');
			}
		}
	};

	var initTripDateInput=function(){
		if(!tripDateInput){
			tripDateInput=$(tripDateInputStr).appendTo(tripDateDOM).keydown(keydownEditTripDate);
		}
	};
	
	var initDatePickerPlugin=function(){
		target.find('#date_picker').daterangepicker({		
			presetRanges: [{text: '今天', dateStart: 'today', dateEnd: 'today' }],
			presets: {
				specificDate: '選擇一日', 
				dateRange: '日期區間'
			},		 
			posX: null,
			posY: null,
			arrows: false, 
			dateFormat: 'yy/mm/dd',
			rangeSplitter: '-',
			rangeStartTitle:'開始日期',
			rangeEndTitle:'結束日期',
			doneButtonText:'完成',
			closeOnSelect:false,
			onOpen: function(){
				var input=$('#trip_date input');	
				if(input.val().split("-")[1])
					$('.ui-daterangepicker-dateRange').click();			
				else if(input.val().split("-")[0].replace(/\//g,'-').replace(/\ /,'')!=getdate())
					$('.ui-daterangepicker-specificDate').click();
			},
			datepickerOptions: {
				changeYear: true,
				changeMonth: true,
				prevText:  '上月' ,  
				nextText:  '下月' , 
				monthNames: [ '1月' , '2月' , '3月' , '4月' , '5月' , '6月' ,'7月' , '8月' , '9月' , '10月' , '11月' , '12月' ],  
				monthNamesShort: [ '1月' , '2月' , '3月' , '4月' , '5月' , '6月' , '7月' , '8月' , '9月' , '10月' , '11月' , '12月' ], 
				dayNames: [ '星期日' , '星期一' , '星期二' , '星期三' , '星期四' , '星期五' , '星期六' ],  
				dayNamesShort: [ '週日' , '週一' , '週二' , '週三' , '週四' , '週五' , '週六' ], 
				dayNamesMin: [ '日' , '一' , '二' , '三' , '四' , '五' , '六' ], 
				showMonthAfterYear:  true 
			}		
		});
	};
	
	var finishEdit=function(){
		tripDateLabel.show();		
		tripDateInput.hide();
		tripDateInput.unbind('clickoutside');
	};
	

	return {
		init:function(){
			tripDateDOM = target.find('#trip_date');
			
			initTripDateLabel();
			initTripDateInput();
			//initDatePickerPlugin();
		},
		refresh:function(){
			setTripDateLabel(DataStatus.trip_date);
		},
		ownerModeSwitch:function(permission){
			if(permission)
				enableEdit();
			else
				disableEdit();
		},
		
		finishEditTripDate:function(){
			keydownEditTripDate();
		}
	};
	
};