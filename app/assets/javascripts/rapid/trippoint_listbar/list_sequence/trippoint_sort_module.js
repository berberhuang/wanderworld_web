//item 會混淆 需重新命名

var TripPointSortItemModule=function(o){
	var target='.trip_point';
	
	var event_ui;
	var target_group_id;
	var target_tripPoint_id;
	var target_item;
	var target_sort_id;
	
	var tripPointItemManager;
	
	//改變tripPoint順序時的反應
	var editPointOrder=function(ui){
		var old_group_id;
		event_ui=ui;
		
		getTarget();
		old_group_id=target_group_id;
		setTargetNewSortId();

		Data.changeTripPointOrder(target_tripPoint_id, target_sort_id, target_group_id);
		
		DataStatus.tripPointList = insertItemToSortedList(DataStatus.tripPointList, target_item);
		
		reinstallClickListener();
		
		contentBox.changeTripPointOrder(old_group_id, target_group_id);		
		tripPointItemManager.updateMark();
		
		PathOnMap.updateMark();		
		PathOnMap.redrawLine();
		reLayout();
	};
	
	var getTarget=function(){
		target_tripPoint_id = getCurrentTripPointId();					
		target_item = getTripPointItem(target_tripPoint_id);			
		target_group_id = target_item.group_id;		
	};
	
	var setTargetNewSortId=function(){
		var g_id=getCurrentGroupId();
		var s_id=genTargetNewSortId();
		
		target_group_id=g_id;
		target_sort_id=s_id;
		
		target_item.group_id=g_id;
		target_item.sort_id=s_id;
	};
	
	var getCurrentTripPointId=function(){
		return event_ui.item.val();
	};	
	
	var getCurrentGroupId=function(){
		return event_ui.item.parents('.trip_point_group').attr('id').split('_group_')[1];
	};

	var genTargetNewSortId=function(){
		var highbound = getNextTripPointSortId();
		var lowbound = getPrevTripPointSortId();	
		return genNewSortId(lowbound,highbound);		
	};

	
	var genNewSortId=function(lowbound,highbound){
		if(highbound==null && lowbound==null){
			return 0;
		}else if(highbound==null){
			return lowbound+1;
		}else if(lowbound==null){
			return highbound-1;
		}else{
			return (lowbound+highbound)/2;
		}
	};

	var getNextTripPointSortId=function(){
		var nextId = getNextTripPointId();
		return getTripPointSortId(nextId);
	};
		
	var getPrevTripPointSortId=function(){
		var prevId = getPrevTripPointId();
		return getTripPointSortId(prevId);
	};
	
	var getNextTripPointId=function(){
		return event_ui.item.next().val();
	};
	
	var getPrevTripPointId=function(){
		return event_ui.item.prev().val();
	};
	
	var getTripPointSortId=function(id){
		var item = getTripPointItem(id);
		if(item)
			return item.sort_id;
		else
			return null;
		
	};
	
	var getTripPointItem=function(id){
		var tpList = DataStatus.tripPointList;
		for(var i=0;i<tpList.length;i++){
			if(tpList[i].id==id){
				return tpList[i];
			}
		}
		return null;
	};
	
	var reinstallClickListener=function(){
		event_ui.item.find('.point_name').unbind('click').click(function(event){
			contentBox.cancelEditWarning(target_group_id,function(){
				var item=$(event.target);
				var id=item.parents('li').val();
				tripPointList.UiListener.clickPointTitle(item.parents('.trip_point_group').attr('id').split('_group_')[1],id);
			});
		}).removeClass('red_box').removeClass('green_box').end();
	}
	
		
	var insertItemToSortedList=function(dst,movedItem){
		var newList=[];
		for(var i=0; i<dst.length; i++){
			if(dst[i] && dst[i]!=movedItem){
				if(movedItem && dst[i].sort_id > movedItem.sort_id){
					newList.push(movedItem);
					movedItem=null;
				}
				newList.push(dst[i]);
			}
		}
		if(movedItem){
			newList.push(movedItem);
		}
		return newList;
	};
	
	return {
		enableSort:function(){
			$(target).sortable({
				disabled: false,
				connectWith: "ul",
				axis: 'y',
				placeholder: "trippoint_placeholder",
				stop:function(event,ui){editPointOrder(ui);}
			});	
		},
		disableSort:function(){
			$(target).sortable({
				disabled: true
			});	
		},
		setTripPointItemManager:function(tpim){
			tripPointItemManager=tpim;
		}
	};
};