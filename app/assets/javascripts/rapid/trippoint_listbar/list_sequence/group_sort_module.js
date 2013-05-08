var GroupSortItemModule = function(o){
	var target=$(o);
	var event_ui;
	var target_group_id;
	var target_item;
	var target_sort_id;
	
	var tripPointItemManager;
	
	//改變遊記的順序	
	var editGroupOrder=function(ui){
		event_ui=ui;
		
		getTarget();
		setTargetNewSortId();
		
		
		Data.changeGroupOrder(target_group_id, target_sort_id);
		
		
		//DataStatus.groupList = insertItemToSortedList(DataStatus.groupList, target_item);
		
		tripPointItemManager.updateMark();
		
		PathOnMap.updateMark();
		PathOnMap.redrawLine();
		reLayout();
	};
	
	var getTarget=function(){
		target_group_id=getCurrentGroupId();
		target_item=getGroupItem(target_group_id);
		target_sort_id=getGroupSortId(target_group_id);
	};

	var setTargetNewSortId=function(){
		var s_id = genTargetNewSortId();
		target_item.data('sortid',s_id);
		target_sort_id=s_id;
	};
	
	var getCurrentGroupId=function(){
		return event_ui.item.data('id');
	};
	
	var getGroupItem=function(group_id){
		var item=$('.trip_point_group:[data-id='+group_id+']');
		if(item.length>0)
			return item.eq(0);
		else
			return null;
	};
	
	var genTargetNewSortId=function(){
		var highbound = getNextGroupSortId();
		var lowbound = getPrevGroupSortId();
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
	
	var getNextGroupSortId=function(){
		var nextId=getNextGroupItemId();
		return getGroupSortId(nextId);
	};

	var getPrevGroupSortId=function(){
		var prevId=getPrevGroupItemId();
		return getGroupSortId(prevId);
	};
	
	var getNextGroupItemId=function(){
		return event_ui.item.next().data('id'); 
	};
	
	var getPrevGroupItemId=function(){
		return event_ui.item.prev().data('id');
	};
	
	var getGroupSortId=function(group_id){
		var item = getGroupItem(group_id);
		if(item)
			return item.data('sortid');
		else
			return null; 
	};

	
	return {
		enableSort:function(){
			target.sortable({
				disabled: false,
				axis: 'y',
				tolerance: 'pointer',
				placeholder: "trippoint_placeholder",
				stop:function(event,ui){editGroupOrder(ui);}
			});
		},
		disableSort:function(){
			target.sortable({
				disabled: true
			});	
		},
		setTripPointItemManager:function(tpim){
			tripPointItemManager=tpim;
		}
	};
};