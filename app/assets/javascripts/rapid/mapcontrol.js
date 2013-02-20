var zoom_w,cen_x,cen_y;
var map_flag=false;
function computeMap(tripPointList)
{
	//找最邊邊的點
	var pointData=tripPointList;
	var array_lat = new Array();
	var array_lng = new Array();
	for(var i in pointData){
		array_lat[i]=pointData[i].place.latitude;
		array_lng[i]=pointData[i].place.longitude;
	}
	var array_left = new Array();
	var array_right = new Array();
	var des;
	var max_left,max_right,now_value=0,min_value=0,max_value=0;
	for(var i in array_lng){
		if(i==0){
			max_left=array_lng[i];
			max_right=array_lng[i];
			continue;	
		}
		if(array_lng[i]>array_lng[i-1]){
			des=array_lng[i]-array_lng[i-1];
			if(des>180){
				array_left[i-1]=array_lng[i];
				array_right[i-1]=array_lng[i-1];
				des=360-des;
				//log('左 '+des);
				now_value-=des;
				if(now_value<min_value){
					max_left=array_lng[i];
					min_value=now_value;
				}
			}
			else{
				array_left[i-1]=array_lng[i-1];
				array_right[i-1]=array_lng[i];
				//log('右 '+des);
				now_value+=des;
				if(now_value>max_value){
                                        max_right=array_lng[i];
					max_value=now_value;
				}
			}
		}
		else{
			des=array_lng[i-1]-array_lng[i];		
			if(des>180){
                                array_left[i-1]=array_lng[i-1];
                                array_right[i-1]=array_lng[i];
				des=360-des;
				//log('右 '+des);
				now_value+=des;
				if(now_value>max_value){
                                        max_right=array_lng[i];
					max_value=now_value;
				}
                        }
                        else{
                                array_left[i-1]=array_lng[i];
                                array_right[i-1]=array_lng[i-1];
				//log('左 '+des);
				now_value-=des;
				if(now_value<min_value){
                                        max_left=array_lng[i];
					min_value=now_value;
				}
                        }
		}
	}	
	var max_y=-90,min_y=90;//緯度
	for(var i in pointData){
			if (pointData[i].place.latitude > max_y)
					max_y = pointData[i].place.latitude;
			if (pointData[i].place.latitude < min_y)
					min_y = pointData[i].place.latitude;
	}
	
	//算出距離與中心
	var des_y,des_x;
        des_y = max_y-min_y;
        cen_y = (max_y+min_y)/2;

	if(max_right > max_left){
		des_x = max_right-max_left;
		cen_x = (max_right+max_left)/2;
	}
	else{
		des_x = 360-(max_left-max_right);
		if(max_left+(des_x/2) > 180)
                        cen_x = max_right - des_x/2;
                else
                        cen_x = max_left + des_x/2;
	}
	//找出地圖適合縮放的大小
	var i;
	var keep_side=64;	//保留邊
	for(i=2;i<=15;i++){
			if(LngToPixel(des_x,i)>($('#map_canvas').width()-$('.list').width()-keep_side)){
					zoom_w=i-1;
					break;
			}
			if(LatToPixel(des_y,i)>($('#map_canvas').height()-keep_side)){
					zoom_w=i-1;
					break;
			}
			if(i==15)
					zoom_w=15;
	}	
	
	MapAdjust(tripPointList);
	map_flag=true;

		
}
//調整地圖的縮放及中心
function MapAdjust(tripPointList) {
	var pointData=tripPointList;
	if(pointData.length==0){	//沒有景點
		map.setCenter(new google.maps.LatLng(23.80, 121.500));
		map.setZoom(8);		
	}else if(pointData.length==1){	//只有一個點
		cen_x=pointData[0].place.longitude;
		cen_y=pointData[0].place.latitude;
		zoom_w=12;
		map.setZoom(zoom_w);
		map.setCenter(new google.maps.LatLng(cen_y, cen_x));
	}else{
		//向下調整16px(因為標誌在實際點的上方),向左調整list的寬度
		map.setCenter(new google.maps.LatLng(cen_y+PixelToLat(16,zoom_w) , cen_x+PixelToLng($('.list').width()/2,zoom_w)));
		map.setZoom(zoom_w);
	}	
}
//經度轉像素
function LngToPixel(lng,zoom) {
        return lng * (256 << zoom) / 360;
}
//像素轉經度
function PixelToLng(pixelX,zoom) {
        return pixelX * 360 / (256 << zoom);
}
//緯度轉像素                      
function LatToPixel(lat,zoom) {
	var siny = Math.sin(lat * Math.PI / 180);
	var y = Math.log((1+siny)/(1-siny));
	return (128 << zoom) * ( y / (2 * Math.PI));
}
//像素轉緯度
function PixelToLat(pixelY,zoom) {
	var y = 2 * Math.PI * (pixelY / (128 << zoom));
	var z = Math.pow(Math.E, y);
	var siny = (z- 1) / (z + 1);
	return Math.asin(siny) * 180 / Math.PI;
}
