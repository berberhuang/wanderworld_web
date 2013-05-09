var TripPointEditModule = function(item){
	var newTripPointInput;
	var newTripPointData={};
	var target = $(item);
	var confirmWindow;
	var tripPointItemManager;
	var groupItemManager;
	
	var name;
	var city;
	
	target.find('.finish').click(function(){tripPointEdit.UiListener.finishSetNewManPos();});
	
	
	var searchOnGoogle=function(search_str,callback){
		var gcoder=new google.maps.Geocoder();
		gcoder.geocode({'address':search_str,'region':'TW'},function(results,status){
			if(status==google.maps.GeocoderStatus.OK){
				var i;
				city=null;
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
				newTripPointData.city=city;
				newTripPointData.pos=results[0].geometry.location;
				if(callback&&callback.success)
					callback.success();				
			}else{
				searchInDBByName(search_str);
			}
		});
	};
	
	var findPlaceInDB=function(){
		var name=newTripPointData.name;
		var city=newTripPointData.city;
		$.get("/trip/findPlace",{p_name:name,p_city:city},function(result){
			if(result){
				var position=new google.maps.LatLng(result[2],result[3],false);
				newTripPointData.pos=position;
				newTripPointData.place_id=result[0];
				findPlaceSuccess();
			}else{
				findNewPlaceNotInDB();
			}
		});
	};

	var findPlaceSuccess=function(){
		var pos=newTripPointData.pos;
		var place_id=newTripPointData.place_id;		
		var name=newTripPointData.name;
		var city=newTripPointData.city;
		var group_id=newTripPointData.group_id;
		
		PathOnMap.createTmpMark(name,group_id,pos);

		newTripPointInput.val(name+','+city);
		confirmTripPoint(name);		
	};

		//show確認新增景點對話框
	var confirmTripPoint=function (name){
		var contentStr='<div>在遊記中標記<span id="3" style="font-weight:bold">&nbsp'+name+'&nbsp</span>。<br /><br />'
				+'<button class="tiny radius" onclick="tripPointEdit.UiListener.confirmOk()">確定</button>&nbsp'
				+'<button class="tiny radius" onclick="tripPointEdit.UiListener.confirmCancel()">取消</button></div>'
				+'<a class="button alert tiny radius right white" id="isWrong" href="javascript:tripPointEdit.UiListener.wrongTripPoint()">位置錯了嗎?</a>';	
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
	
	var findNewPlaceNotInDB=function(){
		var group_id=newTripPointData.group_id
		var name=newTripPointData.name;
		var city=newTripPointData.city;
		var pos=newTripPointData.pos;
				
		PathOnMap.createTmpMark(name,group_id,pos);
		
		newTripPointInput.val(name+','+city);
		
		confirmPlace(name);	
	};

	//show確認新增地點對話框
	var confirmPlace=function(name){
		var contentStr='<div>你是第一個新增這個景點的朋友!<br />請拖曳<img style="width:30px;" src="'+getMarkURL('P',getGroupColor(newTripPointData.group_id,DataStatus.groupList))+'"/>將景點標記在正確位置。<br />'
				+'<button class="tiny radius" onclick="tripPointEdit.UiListener.confirmNewOK()">確定</button>&nbsp;'
				+'<button class="tiny radius" onclick="tripPointEdit.UiListener.confirmCancel()">取消</button></div>'
				+'<a class="button alert tiny radius right white" id="isWrong" href="javascript:tripPointEdit.UiListener.wrongTripPoint()">位置錯了嗎？</a>';	
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
	
	var searchInDBByName=function(search_str){
		$.get("/place/search",{term:search_str},function(result){
			if(result.length){
				findPlaceInDB();					
			}else{
				findNewPlaceFailed();
			}
		});
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
		PathOnMap.closeInfoWindow();
		var tmp_mark=PathOnMap.getTmpMark();
		if(tmp_mark){
			tmp_mark.setDraggable(true);
		}
		$('#add_new').fadeIn(200).find('input').val('');
		
		//按下取消放棄找尋地點
		$('.list').unbind('click').click(function(){
			$('.list').unbind('click');
			$('#add_new').fadeOut(600);
			tripPointEdit.UiListener.confirmCancel();
		});
	}


	//按關鍵字尋找景點位置
	var findPlaceByName=function(group_id,str){
		searchOnGoogle(str,{success:genNewTmpMark});
	};
	
	var genNewTmpMark=function(){
		PathOnMap.createTmpMark(newTripPointData.name,newTripPointData.group_id,newTripPointData.pos);
	};
	
	
	
	
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
				var tmp_mark=PathOnMap.getTmpMark();
				PathOnMap.deleteTmpMark();
				newTripPointInput.val('');
				
				tp.place={
					id:place_id,
					name:name,
					latitude:tmp_mark.position.lat(),
					longitude:tmp_mark.position.lng()
				}
											
				insertTripPoint(tp.id,group_id,sort_id,name,tmp_mark.position.lat(),tmp_mark.position.lng());
				
				updateMark();	
					
				PathOnMap.updateMark();
				PathOnMap.redrawLine();
					
				contentBox.insertNewPoint(group_id);
				PathOnMap.showBeforeReadBubble(tp.id);
				PathOnMap.centerTripPointOnAllMap(tp.id);
				groupItemManager.hideAddPointInput(newTripPointInput);
					
				reLayout();
			});
									
		});
	};
	
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
	
	
	var findNewPlaceFailed=function(){
		var name=newTripPointData.name;
		var group_id=newTripPointData.group_id;
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
			newTripPointData.group_id=group_id;
			newTripPointData.sort_id = sort_id;
			newTripPointData.city=city;
			newTripPointData.name=name;
			if(city&&city.length>0){
				findPlaceInDB();
			}else{
				searchOnGoogle(name,{success:findPlaceInDB});
			}
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
					
					PathOnMap.showBeforeReadBubble(tp.id);
					PathOnMap.centerTripPointOnAllMap(tp.id);
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
							
							insertTripPoint(tp.id,group_id,sort_id,box[0],tmp_mark.position.lat(),tmp_mark.position.lng());
							updateMark();
							
							
							PathOnMap.updateMark();
							PathOnMap.redrawLine();
							
							contentBox.insertNewPoint(group_id);
							PathOnMap.showBeforeReadBubble(tp.id);
							PathOnMap.centerTripPointOnAllMap(tp.id);
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
				target.fadeOut(200);
				moduleInstance.UiListener.confirmCancel();
			}
		}
		
	};
};