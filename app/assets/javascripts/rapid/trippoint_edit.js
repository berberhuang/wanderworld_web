var TripPointEditModule = function(item){
	var newTripPointInput;
	var newTripPointData={};
	var target = $(item);
	var confirmWindow;
	var tripPointItemManager;
	var groupItemManager;
	
	target.find('.finish').click(function(){tripPointEdit.UiListener.finishSetNewManPos();});
	
	
	//判斷現在位置所在區域
	var findZoneByPos=function(name,latlng){
		var gcoder=new google.maps.Geocoder();		
		gcoder.geocode({'latLng':latlng,'region':'TW'},function(results,status){
			if(status==google.maps.GeocoderStatus.OK){
				var i;
				var city;
				for(i=0;i<results[0].address_components.length;i++){
					if(results[0].address_components[i].types[0]==='administrative_area_level_3'){
						city=results[0].address_components[i].long_name;
						break;
					}else if(results[0].address_components[i].types[0]==='administrative_area_level_2'){
						city=results[0].address_components[i].long_name;
						break;
					}else if(results[0].address_components[i].types[0]==='administrative_area_level_1'){
						city=results[0].address_components[i].long_name;
						break;
					}else if(results[0].address_components[i].types[0]==='country'){
						city=results[0].address_components[i].long_name;
						break;
					}
				}
				if(!city)
					city="";
				writePlaceToDB(name,city,latlng);
			}else{
			}
		});
	};

	var writePlaceToDB=function(name,city,pos){
		newTripPointInput.val(name+','+city);
		newTripPointData.city=city;

		Data.createPlace(name,pos.lng(),pos.lat(),city,function(result){

			if(!result){
				$('#add_new').hide();
				tripPointEdit.UiListener.confirmCancel();
				alert('同ID同區域卻要新增的情況：\nSorry，附近已有相同名稱的景點，導致系統無法分辨。\n\n請試著為您的景點加入多>一點資訊\n\t如：麥當勞→麥當勞中山店');
				return;
			}
			
			var sort_id=newTripPointData.sort_id;
			var group_id=newTripPointData.group_id;
			var place_id = result[0];
			PathOnMap.setTmpMark_place_id(result[0]);

			Data.saveTripPoint(-1,place_id,newTripPointData.sort_id,newTripPointData.group_id,function(tp){
				PathOnMap.deleteTmpMark();
				newTripPointInput.val('');
				
				tp.place={
					id:place_id,
					name:name,
					latitude:tmp_mark.position.lat(),
					longitude:tmp_mark.position.lng()
				}
				
				DataStatus.tripPointList.push(tp);
				
				//tripPointList.UiControl.enableAddTripPoint(group_id);
				tripPointList.UiControl.insertTripPoint(tp.id,group_id,name);
				updateMark();
				
				PathOnMap.updateMark();
				PathOnMap.redrawLine();
				reLayout();
			});
									
		});
	};
	
	var findPlaceByNameAndZone=function(group_id,name,zone,ok_callback,new_callback,fail_callback){
		if(!name)
			return;
		if(!zone){
			zone="";
			findPlaceWithoutZone(group_id,name,name,ok_callback,new_callback,fail_callback);
			return;
		}
		var str=name+" "+zone;
		$.get("/trip/findPlace",{p_name:name,p_city:zone},function(result){
			if(result){
				var tmpPoint=new google.maps.LatLng(result[2],result[3],false);
				findPlaceSuccess(group_id,result[0],name,result[1],tmpPoint);
			}else{
				findPlaceWithoutZone(group_id,name,str,ok_callback,new_callback,fail_callback);
			}
		});
	};
	
	var findPlaceWithoutZone=function(group_id,name,search_str,ok_callback,new_callback,fail_callback){
		var gcoder=new google.maps.Geocoder();
		gcoder.geocode({'address':search_str,'region':'TW'},function(results,status){
			if(status==google.maps.GeocoderStatus.OK){
				var i;
				var city;
				for(i=0;i<results[0].address_components.length;i++){
					if(results[0].address_components[i].types[0]==='administrative_area_level_3'){
						city=results[0].address_components[i].long_name;
						break;
					}else if(results[0].address_components[i].types[0]==='administrative_area_level_2'){
						city=results[0].address_components[i].long_name;
						break;
					}else if(results[0].address_components[i].types[0]==='administrative_area_level_1'){
						city=results[0].address_components[i].long_name;
						break;
					}else if(results[0].address_components[i].types[0]==='country'){
						city=results[0].address_components[i].long_name;
						break;
					}
				}
				if(!city)
					city="";
				
				$.get("/trip/findPlace",{p_name:name,p_city:city},function(result){
					if(result){
						var t=new google.maps.LatLng(result[2],result[3],false);
						findPlaceSuccess(group_id,result[0],name,result[1],t);
						//if(ok_callback)
							//ok_callback();
					}else{
						findNewPlaceNotInDB(group_id,name,city,results[0].geometry.location);
						//if(new_callback)
						//	new_callback(group_id,name,city,results[0].geometry.location);
					}
				});
			}else{
				$.get("/place/search",{term:name},function(result){
					if(result.length){
						
						$.get("/trip/findPlace",{p_name:result[0].split(",")[0],p_city:result[0].split(",")[1]},function(result){
							if(result){
								var t=new google.maps.LatLng(result[2],result[3],false);
							
									$('#newTripPoint .place').val(result[4]+','+result[1]);
									findPlaceSuccess(group_id,result[0],name,result[1],t);
									//ok_callback(group_id,result[0],result[4],result[1],t);
							}else{
								findNewPlaceFailed(group_id,name);
								//if(fail_callback)
								//	fail_callback(group_id,name);
							}
						});
						
							
					}else{
						findNewPlaceFailed(group_id,name);
						//if(fail_callback)
						//	fail_callback(group_id,name);
					}
				});
			}
		});

	}
		
	
	
	//按關鍵字尋找景點位置
	var findPlaceByName=function(group_id,str){
		findPlaceByNameAndZone(group_id,str,'',
		function(group_id,place_id,name,city,pos){
			var str= newTripPointData.name;
			newTripPointData.name=str;
			newTripPointData.city=city;
			newTripPointData.pos=pos;
			newTripPointData.place_id=place_id;
			
			PathOnMap.createTmpMark(str,group_id,pos);
			
			newTripPointInput.val(str+','+city);
			PathOnMap.getTmpMark().setDraggable(true);
		},
		function(group_id,name,city,pos){
			var str= newTripPointData.name;
			newTripPointData.name=str;
			newTripPointData.city=city;
			newTripPointData.pos=pos;
			
			PathOnMap.createTmpMark(str,group_id,pos);
			
			newTripPointInput.val(str+','+city);
			PathOnMap.getTmpMark().setDraggable(true);
		},null);
	};
	
	//show確認新增景點對話框
	var confirmTripPoint=function (name){
		var contentStr='<div>將<span id="3" style="font-weight:bold">&nbsp'+name+'&nbsp</span>標記在此<br />'
				+'<button onclick="tripPointEdit.UiListener.confirmOk()">確定</button>'
				+'<button onclick="tripPointEdit.UiListener.confirmCancel()">取消</button></div>'
				+'<a id="isWrong" style="float:right;color:black" href="javascript:tripPointEdit.UiListener.wrongTripPoint()">位置錯了嗎?</a>';	
		if(confirmWindow){
			if(confirmWindow.s_new)
				tripPointEdit.UiListener.confirmNewOK();
			else
				tripPointEdit.UiListener.confirmOk();
		}
		confirmWindow = new google.maps.InfoWindow({
			 content: contentStr,
			 s_new:false
		});
		confirmWindow.open(map,PathOnMap.getTmpMark());	
			google.maps.event.addListener(confirmWindow,'closeclick',function(){tripPointEdit.UiListener.confirmCancel()});
		
		PathOnMap.closeInfoWindow();
	};

		//show確認新增地點對話框
	var confirmPlace=function(name){
		var contentStr='<div>你是第一個新增這個景點的朋友!<br />請拖曳<img style="width:30px;" src="'+getMarkURL('P',getGroupColor(newTripPointData.group_id,DataStatus.groupList))+'"/>將景點標記在正確位置,<br />並按下確定<br />'
				+'<button onclick="tripPointEdit.UiListener.confirmNewOK()">確定</button>'
				+'<button onclick="tripPointEdit.UiListener.confirmCancel()">取消</button></div>'
				+'<a id="isWrong" style="float:right;color:black;text-decoration:underline" href="javascript:tripPointEdit.UiListener.wrongTripPoint()">位置錯了？請按這裡</a>';	
		if(confirmWindow){
			var s=(confirmWindow);
			if(confirmWindow.s_new)
				tripPointEdit.UiListener.confirmNewOK();
			else
				tripPointEdit.UiListener.confirmOk();
			if(s)
				return;
			//closePost();
		}
		confirmWindow = new google.maps.InfoWindow({
			 content: contentStr,
			s_new:true
		});
		confirmWindow.open(map,PathOnMap.getTmpMark());
			google.maps.event.addListener(confirmWindow,'closeclick',function(){tripPointEdit.UiListener.confirmCancel();});
		PathOnMap.closeInfoWindow();
	};

	
	//需要新增找不到位置的地點
	var setNewManPos=function(){
		if(confirmWindow){
			if(confirmWindow.s_new)
				this.UiListener.confirmNewOK();
			else
				this.UiListener.confirmOk();
			$('#slidesContainer').hide();
		}
		var tmp_mark=PathOnMap.getTmpMark();
		if(tmp_mark){
			tmp_mark.setDraggable(true);
		}
		$('#add_new').show(500).find('input').val('');
		
		//按下取消放棄找尋地點
		$('.list').unbind('click').click(function(){
			$('.list').unbind('click');
			$('#add_new').hide(500);
			tripPointEdit.UiListener.confirmCancel();
		});
	}
	

	//關閉描點的資訊框
	var closeMarkDetail=function(){
		if(infowindow)
			infowindow.close();
	}
	//關閉確認訊息框
	var closeConfirmBox=function(){
		if(confirmWindow)
			confirmWindow.close();
		confirmWindow=null;	
	}
	
	var insertTripPoint=function(id,group_id,sort_id,title,lat,lng){
		tripPointItemManager.insertTripPoint(id,group_id,sort_id,title,lat,lng);
	};
	
	var updateMark=function(){
		tripPointItemManager.updateMark();
	};
	
	var findPlaceSuccess=function(group_id,place_id,name,city,pos){
		newTripPointData.name=name;
		newTripPointData.city=city;
		newTripPointData.pos=pos;
		newTripPointData.place_id=place_id;
		
		PathOnMap.createTmpMark(name,group_id,pos);

		newTripPointInput.val(name+','+city);
		confirmTripPoint(name);
		
	};
	
	var findNewPlaceNotInDB=function(group_id,name,city,pos){
		newTripPointData.name=name;
		newTripPointData.city=city;
		newTripPointData.pos=pos;
				
		PathOnMap.createTmpMark(name,group_id,pos);
		
		newTripPointInput.val(name+','+city);
		
		confirmPlace(name);	
	};
	
	var findNewPlaceFailed=function(group_id,name){
		newTripPointData.name=name;
		//提供給使用者移動標示新地點用
		$('#pointTarget').attr('src',getMarkURL('P',getGroupColor(group_id)))
		setNewManPos();
	};
	
	

	
	return {
		setTripPointItemManager:function(tpim){
			tripPointItemManager=tpim;
		},
		setGroupItemManager:function(gim){
			groupItemManager=gim;
		},
		setNewTripPointInput:function(item){
			newTripPointInput=item;
		},
		findTripPointByName:function(name,city,group_id,sort_id){
			var gcoder=new google.maps.Geocoder();
		
			newTripPointData.group_id=group_id;
			newTripPointData.sort_id = sort_id;

			findPlaceByNameAndZone(group_id,name,city,
			//ok_callback
			function(){
				findPlaceSuccess(group_id,place_id,name,city,pos);
			},
			//new pos callback
			function(){
				findNewPlaceNotInDB(group_id,name,city,pos);
			},
			//unknown pos callback
			function(){
				findNewPlaceFailed(group_id,name);
			});
		},
		
		
		
			
		UiListener:{
			//新增景點確認
			confirmOk:function(){
				var item=newTripPointInput;
				var place_id=newTripPointData.place_id;
				var sort_id=newTripPointData.sort_id;
				var group_id=newTripPointData.group_id;
				var name = newTripPointData.name;
				var tmp_mark=PathOnMap.getTmpMark();
				
				Data.saveTripPoint(-1,place_id,sort_id,group_id,function(tp){
					tripPointEdit.UiListener.confirmCancel();
					
					tp.place={
						id:place_id,
						name:name,
						latitude:tmp_mark.position.lat(),
						longitude:tmp_mark.position.lng()
					}
					
					
					//tripPointList.UiControl.enableAddTripPoint(group_id);
					insertTripPoint(tp.id,group_id,sort_id,name,tmp_mark.position.lat(),tmp_mark.position.lng());
					updateMark();
					
					
					PathOnMap.updateMark();
					PathOnMap.redrawLine();
					
					contentBox.insertNewPoint(group_id);
					groupItemManager.hideAddPointInput(item);
					reLayout();
					
				});
			},
				
				//新增地點確認
			confirmNewOK:function(){
				log('confirmNewOk');
				var item=newTripPointInput;
				var str=item.val();
				var box=str.split(",");
				var tmp_mark=PathOnMap.getTmpMark();
				Data.createPlace(box[0],tmp_mark.position.lng(),tmp_mark.position.lat(),box[1],function(result){
					log('finishCreatePlace');
					log(result[0]);
					if(result[0]){
						var sort_id=newTripPointData.sort_id;
						var group_id=newTripPointData.group_id;
						var place_id = result[0];
						PathOnMap.setTmpMark_place_id(result[0]);

						Data.saveTripPoint(-1,place_id,sort_id,group_id,function(tp){
							tripPointEdit.UiListener.confirmCancel();
							//PathOnMap.deleteTmpMark();
							/*
							tp.place={
								id:place_id,
								name:box[0],
								latitude:tmp_mark.position.lat(),
								longitude:tmp_mark.position.lng()
							}
							
							DataStatus.tripPointList.push(tp);
							*/
							//tripPointList.UiControl.enableAddTripPoint(group_id);
							//tripPointList.UiControl.insertTripPoint(tp.id,group_id,box[0]);
							insertTripPoint(tp.id,group_id,sort_id,box[0],tmp_mark.position.lat(),tmp_mark.position.lng());
							updateMark();
							
							
							PathOnMap.updateMark();
							PathOnMap.redrawLine();
							
							contentBox.insertNewPoint(group_id);
							
							//tripPointList.reActSortable();
							groupItemManager.hideAddPointInput(item);
							
							reLayout();
							
						});
					}else{
						alert('fail save');
					}
				});
			},
				
			//取消確認對話框
			confirmCancel:function(){
				PathOnMap.deleteTmpMark();
				
				closeConfirmBox();
				closeMarkDetail();
				
				
				if(newTripPointInput){
					newTripPointInput.val("");
					newTripPointInput.focus();
				}
			},
			

			searchPos:function(event){
				if(event.type=='click'||event.type=='keydown'&&event.keyCode==13)
					findPlaceByName(newTripPointData.group_id,$('#add_new input').val());
			},
			
			
			
			
			//按下自訂景點位置的完成
			finishSetNewManPos:function(){
				var tmp_mark=PathOnMap.getTmpMark();
				if(tmp_mark){
					findZoneByPos(newTripPointData.name,tmp_mark.position);
				}else
					tripPointEdit.UiListener.confirmCancel();
				$('#add_new').hide();
			},
			wrongTripPoint:function(){
				closeConfirmBox();
				closeMarkDetail();
				
				$('#pointTarget').attr('src',getMarkURL('P',getGroupColor(newTripPointData.group_id)));
				
				setNewManPos();
			},
			//取消新增手動地點
			cancelSetNewManPos:function(){
				target.hide();
				moduleInstance.UiListener.confirmCancel();
			}
		}
		
	};
};