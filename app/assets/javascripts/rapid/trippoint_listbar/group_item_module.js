var GroupItemModule=function(obj){
	var target=obj;
	
	var groupLabel=[];
	var groupInput=[];
	
	var showingGroup=null;
	
	var newGroupInputStr='<div id="trip_point_group_0" class="trip_point_group" data-id="0"> \
						  <input value="" size="18" placeholder="輸入遊記名稱" /> \
						  </div>';
	
	var container=target.find('.trip_point_all');	
	var newGroupDom=$(newGroupInputStr);

	
	var clear=function(){
		container.empty();
	};
	
	var showAddGroupInput=function(){
		newGroupDom.appendTo(container);
		var newGroupInput= newGroupDom.find('input').val('').keydown(keydownEditGroupName).focus();
		
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
			
			tipInstance.show(5);
		});
		
	};

	var removeNewGroupNameInput=function(){
		target.find('#trip_point_group_0').unbind('clickoutside').remove();
	};
	
	var genNewGroupSortId=function(){
		var group = $('.trip_point_group:last');
		var sort_id = 0;

		if(group){
			sort_id=group.data('sortid');
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
		
		str+='	<div class="journal_title large-10 columns" title="'+title+'"><h5><a href="#">'+title+'</a></h5>';
		str+='	<input style="display:none"></input>';
		str+='	</div>';
		str+='	<div class="trip_point_edit large-2 columns right"></div>';	
		str+='  <ul class="trip_point"></ul>';
		str+='  <div id="add_trip_point_div" class="large-12 columns large-centered"></div>';
		str+='</div>';

		var item=$(str).appendTo(target.find('.trip_point_all'));
		initEvent(item,group_id);

		if(DataStatus.isOwner){
			ownerModeEnable(item);
		}
		contentBox.UiControl.showJournalSwitchToggle();
	};
	
	var initEvent=function(item,group_id){
		item.find('.journal_title input').keydown(keydownEditGroupName).end()
			.find('.journal_title').click(function(event){
				clickGroupTitle(group_id);
			}).end();
	};
	
		
	var ownerModeEnable=function(item){
		var str='<h5><i class="foundicon-tools"></i></h5>';
		item.find('.trip_point_edit').append(str).click(showEditGroupMenu);
		
		str='<div class="add_trip_point large-12 columns"><i class="foundicon-plus"></i>新增景點</div>';
		item.find('#add_trip_point_div').append(str);
		
		var addTripPointButton=item.find('.add_trip_point');
		setAddPointButton(addTripPointButton,item.data('id'));
	};
	
	//按下群組名稱
	var clickGroupTitle=function(group_id){
		document.title='WanderWorld地球漫遊 - '+DataStatus.trip_name;
		window.history.pushState(null,document.title,'/'+DataStatus.trip_id);	

		var tp=$('.trip_point_group:[data-id='+group_id+'] .point');
		
		if(tp.length>0){
			tp.eq(0).find('.point_name').click();				
		}else{
			contentBox.cancelEditWarning(group_id,function(){
				PathOnMap.closeInfoWindow();
				contentBox.UiControl.showBlankContentBox(group_id);
				tripPointList.unselect();
				selectGroupEffect($('.trip_point_group:[data-id='+group_id+']'));
			});
		}
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
					contentBox.clickEditPost(group_id,target.find('.trip_point_group:[data-id='+group_id+'] .point:first').data('id'));	
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
		var item = target.find('.trip_point_group:[data-id='+id+'] .journal_title');
		
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
		var group=$('.trip_point_group:[data-id='+id+']');
		var name=group.find('.journal_title a').text();
		if(window.confirm('您確定要刪除 '+name+' ?') == false){	
			return;
		}		
		Data.deleteGroup(id);
				
		group.remove();
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
		
		if(contentBox.getShowGroupId()==id){
			contentBox.setGroupTitle(result);
		}
		
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
		groupLabel[id].parents('.journal_title').attr('title',str);
	};
	
	var setGroupNameInput=function(id,str){
		initGroupNameInput(id);
		groupInput[id].val(str);
	};

	var initGroupNameLabel=function(id){
		if(!groupLabel[id])
			groupLabel[id]=target.find('.trip_point_group:[data-id='+id+'] .journal_title a:eq(0)');
	};
	
	var initGroupNameInput=function(id){
		if(!groupInput[id])
			groupInput[id]=target.find('.trip_point_group:[data-id='+id+'] .journal_title input');
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
				initEvent(t,t.data('id'));
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
		selectGroup:function(id){
			selectGroupEffect($('.trip_point_group:[data-id='+id+']'));
		},
		unselectGroup:function(id){
			unselectGroupEffect();
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
		},
		editJournal:function(group_id){
			contentBox.clickEditPost(group_id,target.find('.trip_point_group:[data-id='+group_id+'] .point:first').data('id'));	
			showingGroup=group_id;
		}		
	};
};
