var ListSequenceModule=function(){
	var groupSorting=GroupSortItemModule('.trip_point_all');
	var tripPointSorting=TripPointSortItemModule('.trip_point');
	
	var enableSort=function(){
		tripPointSorting.enableSort();
		groupSorting.enableSort();
	};
	
	var disableSort=function(){
		tripPointSorting.disableSort();
		groupSorting.disableSort();
	};
	

	
	
	return {
		//起動調換順序事件
		ownerModeSwitch:function(permission){
			if(permission)
				enableSort();
			else
				disableSort();
		},
		setTripPointItemManager:function(tpim){
			tripPointSorting.setTripPointItemManager(tpim);
			groupSorting.setTripPointItemManager(tpim);
		}
	};
	
};