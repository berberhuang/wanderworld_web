var GroupItemModule=function(obj){
	var target=obj;
	
	var groupLabel=[];
	var groupInput=[];
	
	var tripPointItemManager;
	var showingGroup=null;
	
	var newGroupInputStr='<div id="trip_point_group_0" class="trip_point_group" data-id="0"> \
						  <input value="" placeholder="輸入遊記名稱" /> \
						  </div>';
	
	var container=target.find('.trip_point_all');	
	var newGroupDom=$(newGroupInputStr);

	
	var clear=function(){
		container.empty();
	};
	
	var showAddGroupInput=function(){
		newGroupDom.appendTo(container);
		var newGroupInput= newGroupDom.find('input').keydown(keydownEditGroupName).focus();
		
		reLayout();		
		setClickOutsideEvent(newGroupDom,function(){
				var name = newGroupInput.val();
				
				if(!isStringNull(name)){
					finishNewGroupName(name);
				}else{
					newGroupDom.unbind('clickoutside').remove();
					reLayout();
				}
			});
	};

	var finishNewGroupName=function(groupName){
		removeNewGroupNameInput();
		var sort_id = genNewGroupSortId();
		
		Data.createGroup(groupName,function(gid){
			//DataStatus.groupList.push({id:gid,title:groupName,sort_id:sort_id});
			insertGroup(gid,sort_id,groupName);
			reLayout();
			$('.scroll-pane').animate({scrollTop:$('.trip_point_all').height()}, 'slow');	
		});
	};

	var removeNewGroupNameInput=function(){
		target.find('#trip_point_group_0').unbind('clickoutside').remove();
	};
	
	var genNewGroupSortId=function(){
		var groupList = $('.trip_point_group');
		var sort_id = null;
		
		for(var i=0; i < groupList.length; i++){
			if( !sort_id || groupList.eq(i).data('sort_id') > sort_id ){
				sort_id = groupList.eq(i).data('sort_id');
			}
		}
		return sort_id+1;
	};
	

	
	var setGroupList=function(groupList){
		var groupList_size=groupList.length;
		
		for(i=0;i<groupList.length;i++){
			insertGroup(groupList[i].id,groupList[i].sort_id, groupList[i].title);
		}
	};
	
	var insertGroup=function(group_id,sort_id,title){
		
		var str='';
		str+='<div id="trip_point_group_'+group_id+'" class="trip_point_group row"';
		str+=' data-id="'+group_id+'"';
		str+=' data-sortid="'+sort_id+'"';
		str+='>';
		
		str+='<div class="journal_title large-10 columns"><h5><a href="#">'+title+'</a></h5>'
			+'<input placeholder="輸入遊記名稱" style="display:none;"></div>';                                            
		str+='<div class="trip_point_edit large-2 columns right"></div>';	
		str+='  <ul class="trip_point"></ul>';
		str+='  <div id="add_trip_point_div" class="large-10 columns large-centered"></div>';
		str+='  <div"></div>';
		str+='</div>';
		
		var item=$(str).appendTo(target.find('.trip_point_all'));
		initEvent(item,group_id);

		if(DataStatus.isOwner){
			ownerModeEnable(item);
		}
	};
	
	var initEvent=function(item,group_id){
		item.find('.trip_point_title input').keydown(keydownEditGroupName).end()
			.find('.trip_point_title').click(function(event){
				contentBox.cancelEditWarning(group_id,function(){
					clickGroupTitle(group_id);
					var item=$(event.target);
					selectGroupEffect(item.parents('.trip_point_group'));
				});
			}).end();
	};
	
		
	var ownerModeEnable=function(item){
		var str='<h5><i class="foundicon-edit white"></i></h5>';
		item.find('.trip_point_edit').append(str).click(showEditGroupMenu);
		
		str='<div class="add_trip_point large-12 columns text-center"><i class="foundicon-plus"></i><i class="foundicon-location"> </i>新增景點</div>';
		item.find('#add_trip_point_div').append(str);
		
		var addTripPointButton=item.find('.add_trip_point');
		setAddPointButton(addTripPointButton,item.data('id'));
	};
	
	//按下群組名稱
	var clickGroupTitle=function(group_id){
		document.title='WanderWorld地球漫遊 - '+DataStatus.trip_name;
		window.history.pushState(null,document.title,'/'+DataStatus.trip_id);
						
		if(showingGroup!=group_id){
			var tpList=$('.trip_point_group:[data-id='+group_id+'] .point');			
			computeMap(tpList);
		}
		if(contentBox.isShow()&&showingGroup==group_id){
			contentBox.UiControl.showContent(group_id);					
		}else{
			contentBox.UiControl.hide();
			contentBox.reset();
			PathOnMap.closeInfoWindow();
		}
		showingGroup=group_id;
	};
				
	var selectGroupEffect=function(item){
		unselectGroupEffect();
		item.addClass('trip_point_group_selected');
	};
	
	var unselectGroupEffect=function(){
		target.find('.trip_point_group').removeClass('trip_point_group_selected');
	};
	
	
	var showEditGroupMenu=function(event){
		var item=$(event.target).parents('.trip_point_group');
		var group_id=item.attr('id').split('_group_')[1];
		var x=item.offset().left;
		var y=item.offset().top;
		
		var str='';
		str+='<div class="group_edit_menu">';
		str+='<div id="edit_name"><i class="foundicon-edit"></i>更改遊記名稱</div>';
		str+='<div id="edit_post"><i class="foundicon-edit"></i>編輯遊記</div>';
		str+='<div id="delete_group"><i class="foundicon-trash"></i>刪除遊記</div>';
		str+='</div>';				
		
		var menu=$(str).appendTo('#trip_one').show().css('position','absolute').offset({left:x+105,top:y+18});
		
		menu.find('#edit_name').click(function(){
				clickEditGroupName(group_id);
				
				menu.unbind('clickoutside');
				menu.unbind('mouseleave');
				menu.remove();
			}).end()
			.find('#delete_group').click(function(){
				clickDeleteGroup(group_id);
				
				menu.unbind('clickoutside');
				menu.unbind('mouseleave');
				menu.remove();
			}).end()
			.find('#edit_post').click(function(){
				contentBox.cancelEditWarning(group_id,function(){
					contentBox.clickEditPost(group_id,target.find('#trip_point_group_'+group_id+' li:first').val());	
					showingGroup=group_id;
				});
				menu.unbind('clickoutside');
				menu.unbind('mouseleave');
				menu.remove();
			});

		
		setTimeout(function(){
			menu.bind('clickoutside',function(){						
				menu.unbind('clickoutside');
				menu.unbind('mouseleave');
				menu.remove();
			});
			menu.bind('mouseleave',function(){						
				menu.unbind('clickoutside');
				menu.unbind('mouseleave');
				menu.remove();
			});
		},50);
	};
	
	var clickEditGroupName=function(id){
		var item = target.find('.trip_point_group:[data-id='+id+'] .trip_point_title');
		
		var a=item.find('a').hide();
		var input=item.find('input').val(a.text()).show().focus();
					
		setTimeout(function(){
				input.bind('clickoutside',function(){
					finishEditGroupName(id);
					input.unbind('clickoutside');
				});
		},50);
		
		reLayout();
		
	};
	
	var clickDeleteGroup=function(id){
		if(!Data.deleteGroup(id)){
			return;
		}
		var groupList=$('.trip_point_group');
		//var tpList=DataStatus.tripPointList;
		
		target.find('.trip_point_group:[data-id='+id+']').empty().remove();
		tripPointItemManager.updateMark();
		contentBox.deleteGroup(id);
		
		PathOnMap.updateMark();
		PathOnMap.redrawLine();
		
		reLayout();
	};
	
	var keydownEditGroupName=function(event){
		if(event.keyCode==13){
			var id=$(this).parents('.trip_point_group').data('id');
			if(id!=0){
				//change group name
				finishEditGroupName(id);
			}else{
				//new group
				var name=event.target.value.replace(/[\s]*/,"");
				if(name.length!=0){
					finishNewGroupName(name);
				}				
			}
			$(event.target).unbind('clickoutside');
		}
	};
	
	var finishEditGroupName=function(id){
		var label=getGroupNameLabel(id);
		var input=getGroupNameInput(id);
		var result= !isStringNull(input) ? input : label;
		
		setGroupNameLabel(id,result);
		finishEdit(id);
		
		for(var i in DataStatus.groupList){
			if(DataStatus.groupList[i].id==id){
				DataStatus.groupList[i].title=result;
				break;
			}
		}
		contentBox.setGroupTitle(result);
		
		Data.saveGroupName(id);
		reLayout();
	};
	
		
	var finishEdit=function(id){
		groupLabel[id].show();
		groupInput[id].hide();
	};
	
	var getGroupNameLabel=function(id){
		initGroupNameLabel(id);
		return groupLabel[id].text();
	};
	
	var getGroupNameInput=function(id){
		initGroupNameInput(id);
		return groupInput[id].val();
	};
	
	var setGroupNameLabel=function(id,str){
		initGroupNameLabel(id);
		groupLabel[id].text(str);
	};
	
	var setGroupNameInput=function(id,str){
		initGroupNameInput(id);
		groupInput[id].val(str);
	};

	var initGroupNameLabel=function(id){
		if(!groupLabel[id])
			groupLabel[id]=target.find('.trip_point_group:[data-id='+id+'] .trip_point_title a:eq(0)');
	};
	
	var initGroupNameInput=function(id){
		if(!groupInput[id])
			groupInput[id]=target.find('.trip_point_group:[data-id='+id+'] .trip_point_title input');
	};

	
	
	var setAddPointButton=function(item,group_id){
		var addFunc=genFunctionBox(showAddPointInput,group_id)
		item.click(function(event){
			$(event.target).parents('.trip_point_group').find('.add_trip_point').addClass('hidden').removeClass('add_trip_point')
			.next().css('position','absolute');
			addFunc();
			reLayout();
			event.stopPropagation();
		});
	};
	
	var showAddPointInput=function(group_id){
		var str='';
		str+='<div id="newTripPoint" value="'+group_id+'">';
		str+='<input class="place" type="text" size="20" placeholder="輸入景點名稱" />';
		str+='</div>';	
		
		var item=$(str).appendTo(target.find('#trip_point_group_'+group_id ))
						.find('input')
						.keydown(function(event){
								tripPointItemManager.addNewTripPoint(event,group_id,$(this))
							})
						.blur(function(event){blurAddPointInput(event,group_id);})
						.focus()		
						.autocomplete({
							source:'/place/search',
							position: { my: "right top", at: "right bottom", collision: "none" }		
						});
	};
	
	var blurAddPointInput=function(event,group_id){
		var item=getNewPointInput(group_id);
		if(!isStringNull(item.val()))
			return;
		hideAddPointInput(item);
	};
	
	var getNewPointInput=function(group_id){
		return $('.trip_point_group:[data-id='+group_id +'] .place');
	};
	
	var hideAddPointInput=function(item){
		item.parents('.trip_point_group').find('.hidden').addClass('add_trip_point')
										.removeClass('hidden').next().css('position','static');
		item.parent().remove();
	};
	
	var getSelectedGroupItem=function(){
		return $('.trip_point_group_selected');
	};
	
	var getSelectedGroupId=function(){
		return getSelectedGroupItem().data('id');
	};
	
	return {
		init:function(){
			target.find('#group_create_button').click(showAddGroupInput);
		},
		initJavascript:function(){
			var a=$('.trip_point_group');
			
			for(var i=0; i<a.length; i++){
				var t=a.eq(i);
				initEvent(t);
				if(DataStatus.isOwner){
					ownerModeEnable(t);
				}
			}
		},
		refresh:function(groupList){
			setGroupList(groupList);
		},
		reset:function(){
			clear();
		},
		setTripPointItemManager:function(tpim){
			tripPointItemManager=tpim;
		},
		selectGroup:function(id){
			selectGroupEffect($('.trip_point_group:[data-id='+id+']'));
		},
		getSelectedGroupId:function(){
			return getSelectedGroupId();
		},
		getSelectedGroupItem:function(){
			return getSelectedGroupItem();
		},
		ownerModeSwitch:function(permission){
			if(permission){
				target.find('#group_create_button').show();
			}else{
				target.find('#group_create_button').hide();	
			}
		},
		hideAddPointInput:function(item){
			hideAddPointInput(item);
		}
	};
};