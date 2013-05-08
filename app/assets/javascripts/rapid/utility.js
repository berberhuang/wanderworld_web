//除錯用
function log(e){
	console.log(e);
}
//取得現在時間(yyyy-mm-dd)
function getdate(){   
	var now=new Date();
	y=now.getFullYear();
	m=now.getMonth()+1;
	d=now.getDate();
	m=m<10?"0"+m:m;
	d=d<10?"0"+d:d;
	return y+"-"+m+"-"+d;
}

//取得兩個日期的間隔天數 
function getDateDiff(sDate1, sDate2){ //sDate1和sDate2是2002-12-18格式 
	var aDate, oDate1, oDate2, iDays; 
	aDate = sDate1.split("-");
	oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]); //轉換為12/18/2002格式 
	aDate = sDate2.split("-"); 
	oDate2 = new Date( aDate[1] + '/' + aDate[2] + '/' + aDate[0]); 
	iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24); //把相差的毫秒數轉換為天數 
	return iDays; 
}
//取得標記URL
function getMarkURL(number,color){	
	//繪製圖標
	var w = 30,h = 30;
	var icon_canvas = document.createElement('canvas');
	var context = icon_canvas.getContext('2d');
	icon_canvas.width = w;
	icon_canvas.height = h;
	context.beginPath();
	context.fillStyle = 'rgb(255, 255, 255)' ;
	context.arc(15, 15, 15, 0, Math.PI*2, false );
	context.fill();		
	context.beginPath();
	context.fillStyle = color;
	context.arc(15, 15, 12, 0, Math.PI*2, false );
	context.fill();	
	context.fillStyle = '#ffffff';
	context.font = 'bold 18px sans-serif';
	context.textAlign = 'center';
	context.fillText(number, 15, 21);
	return icon_canvas.toDataURL();
}
//取得群組顏色
function getGroupColor(group_id){
	var color=['rgba(63,169,245,1)','rgba(145,62,222,1)','rgba(201,50,50,1)','rgba(255,160,81,1)','rgba(68,201,100,1)'];
	//var groups=DataStatus.groupList;
	var groups=$('.trip_point_group');
	
	for(var i=0;i<groups.length;i++){
		if(groups.eq(i).data('id')==group_id){
			i=i%5;
			break;
		}
	}
	
	return color[i];
}

var isStringNull=function(str){
	if(removeSpaceOfString(str).length==0)
		return true;
	return false;
};

var removeSpaceOfString=function(str){
	return str.replace(/[\s]*/,"");
};

var setClickOutsideEvent=function(item,func){
	setTimeout(function(){item.bind('clickoutside',func)},50);
};

var genFunctionBox=function(func){
	//create a closure to store arguments data
	if( !jQuery.isFunction(func) )
		return null;
	var data=Array.prototype.slice.call(arguments);
	data = data.slice(1,data.length);
	return function(){
				func.apply(this,data);
			};
};