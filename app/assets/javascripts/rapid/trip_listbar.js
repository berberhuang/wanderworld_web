var TripListbarModule = function(obj){
	var target = $(obj);
	var createTripButton = target.find('#trip_create');
	var listCanvas = target.find('#dates');
	
	var UiListener = {
		clickNewTrip:function(){
			createNewTrip();			
		},
		clickEditTrip:function(){
			var item=getDeleteButtonOnTripEditMenu($(this));
			item.show();
			setClickOutsideEvent(item,function(){
				item.hide();
				item.unbind('clickoutside');
			});
		}
	};
	
	var buttonInit=function(){
		createTripButton.click(UiListener.clickNewTrip);
	};
	
	var timelineInit=function(){
			//可垂直拖曳
			listCanvas.draggable({ axis: "y" });	
			//點擊時變換遊標圖示
			listCanvas.mousedown(function(){
				listCanvas.css("cursor","url('/assets/cursor_drag_hand.png'),auto");
			}).mouseup(function(){
				listCanvas.css("cursor","url('/assets/cursor_hand.png'),auto");
			});	
			//滑鼠滾輪滾動時間軸
			listCanvas.bind("mousewheel",function(event, delta) {
				if(delta>0){
					listCanvas.css('top',(listCanvas.position().top+30)+"px");
				}else{
					listCanvas.css('top',(listCanvas.position().top-30)+"px");
				}
			});
	};
	
	var clearDataOnList=function(){
		listCanvas.empty();
	};
	
	var drawTripList=function(){
		if(DataStatus.tripList.length==0)
			drawNoTripItem();
		else
			drawManyTripItem();
	};
	
	var drawNoTripItem=function(){
		var nowtime=new Date();
		var str=genYearItem('Now','selected');
		str+=genYearItem(nowtime.getFullYear());
		listCanvas.append(str);
	};
	
	var drawManyTripItem=function(){		
		drawYearPart();
		drawTripPart();
	};
	
	var drawYearPart=function(){
		var yearlist=[];
		var tripList=DataStatus.tripList;
		var maxyear=parseInt(tripList[0].start_date.split('-')[0])+1;
		var str=genYearItem(maxyear);
		
		for(var i=0;i<tripList.length;i++){
			var year=tripList[i].start_date.split('-')[0];
			if(!yearlist[year]){
				str+=genYearItem(year);
			}
			yearlist[year]=true;
			tripList[i].year=year;
		}
		listCanvas.append(str);
	};
	
	var drawTripPart=function(){
		var tripList=DataStatus.tripList;
		var nowtime=new Date();
		var now_flag=false;
		for(var i=0; i<tripList.length; i++){
			var tripcard='';
			if(!now_flag && new Date(tripList[i].start_date) < nowtime){
				tripcard+=genYearItem('Now','selected');
				now_flag=true;
			}
			tripcard+=genTripItem(tripList[i]);
			getYearBlock(tripList[i].year).before(tripcard);
		}
	};
	
	var genYearItem=function(year,selected){
		if(selected)
			return '<li id="year_label_'+year+'"><a class="selected">'+year+'</a></li>';
		else
			return '<li id="year_label_'+year+'"><a>'+year+'</a></li>';
	};
	
	var genTripItem=function(trip){
		var str='';
		str+='<div id="trip_list_'+trip.id+'" class="trip_list_info" >';
		str+='<div class="trip_edit" title="編輯"></div>';		
		str+='<div onclick="loadTrip('+trip.id+')">';
		str+='<div class="trip_list_date">'+trip.start_date+'</div>';
		str+='<div class="trip_list_name">'+trip.name+'</div>';
		str+='</div></div>';
		return str;
	};
	
	var showCreateTripButton=function(){
		createTripButton.show();
	};
	
	var insertEditMenuOnTrip=function(){
		for(var i=0; i<DataStatus.tripList.length; i++){
			var trip_id=DataStatus.tripList[i].id;
			var editMenu = genEditMenu(trip_id);	
			var tripEditBlock = getTripEditBlock(i);
			
			tripEditBlock.append(editMenu).click(UiListener.clickEditTrip);	
			
			var deleteButton = getDeleteButtonOnTripEditMenu(tripEditBlock);
			deleteButton.click(genFunctionBox(Data.deleteTrip,trip_id));
		}		
	};
	
	var genEditMenu=function(trip_id){
		var editMenuStr='';
		editMenuStr+='<img src="/assets/edit2.png"></img>';
		editMenuStr+='<div class="trip_edit_menu">';
		editMenuStr+='<div><img src="/assets/delete1.png">刪除</div>';
		editMenuStr+='</div>';		
		return editMenuStr;
	};
	
	var getYearBlock=function(trip_id){
		return $('#year_label_'+trip_id);
	};
	
	var getTripEditBlock=function(i){
		return target.find('.trip_edit:eq('+i+')');
	};
	
	var getDeleteButtonOnTripEditMenu=function(parent){
		return getTripEditMenuButton(parent,0);
	};
	
	var getTripEditMenuButton=function(parent,i){
		return parent.find('.trip_edit_menu:eq('+i+')');
	};
	
	return {
		init_trip_listbar:function(){
			if(!EnvData.isTripListLoaded){
				buttonInit();		
				timelineInit();
				EnvData.isTripListLoaded=true;
			}
		},
		
		reset:function(){
			clearDataOnList();
		},
		
		loadTripList:function(user_id){
			this.init_trip_listbar();
			drawTripList();
			this.ownerModeSwitch();
		},
		
		ownerModeSwitch:function(){
			if(DataStatus.isOwner){
				showCreateTripButton();
				insertEditMenuOnTrip();					
			}
		},
		
		UiControl:{
			show:function(){
				target.show();
			},
			hide:function(){
				target.hide();
			}
		}
	};
};
