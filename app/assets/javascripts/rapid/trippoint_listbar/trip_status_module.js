var TripStatusModule = function(obj){
	var target=obj;
	var tripStatusLabel;
	
	var initTripStatusLabel=function(){
		if(!tripStatusLabel)
			tripStatusLabel=target.find('#trip_status:first');
	};
	var setTripStatusLabel=function(str){
		initTripStatusLabel();
		tripStatusLabel.find('a').text(str);
	};
	
	var convertDateStringToDurationObj=function(str){
		var obj={};
		var tmp=removeSpaceOfString(str).split("-");
		obj.start=tmp[0].replace(/\//g,'-').replace(/\ /,'');
		if(tmp[1])
			obj.end = tmp[1].replace(/\//g,'-').replace(/\ /,'');
		else
			obj.end = obj.start;
		return obj;
	};
	
	return {
		refresh:function(){
			this.updateTripStatus(DataStatus.trip_status);
			
		},
		updateTripStatus:function(str){
			var duration=convertDateStringToDurationObj(str);  //return Object{start,end}
		
			initTripStatusLabel();
			if( getdate() < duration.start ){
				tripStatusLabel.show()
				setTripStatusLabel('倒數 '+getDateDiff(duration.start,getdate())+' 天');
			}else if(getdate() >= duration.start && getdate() <= duration.end){
				tripStatusLabel.show()
				setTripStatusLabel('正在旅行');
			}else if( getdate() > duration.end){
				tripStatusLabel.hide()
			}
		}
	};
};