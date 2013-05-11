
var ContentBoxModule = function(item){
	var target=$(item);
	var contentPanel=target.find('#postContent');
	var editTool = target.find('.editTool');
	var journalSwitchToggle = $('#bounce');	

	var controlButton = target.find('.controlButton');
	
	var draftButtons=target.find('#draftButtons');
	var releaseButtons=target.find('#releaseButtons');
	
	var releasePost=target.find('#releasePost');
	var finishPost=target.find('#finishPost');
	var cancelEdit=target.find('#cancelEdit');
	var toDraft=target.find('#toDraft');
	
	editor=[];

	var edit_id;
	var edit_group_id;
	var show_group_id=null;
	
	
	var moduleInstance;

	var install_resize=function(e){
		var t=$(e.target);
		t.unbind('click');
		t.resize_by_drag();
		t.parent().bind('clickoutside',function(){
			t.resize_by_drag('destroy');
			t.click(install_resize);
		});
		
	};
	
	var isBounce=function(){
		if(target.css('z-index')==-1){
			return false;
		}
		return true;
	};
	
	//展開遊記	
	var bounce=function(){		
		target.css('z-index','0');			
	};
	//收合遊記
	var collapse=function(stopShow){
		if(edit_group_id){
			for(var i in editor){
				editor[i].focusManager.blur();
			}
		}
		target.css('z-index','-1');
	};

	var initInterface=function(){
		contentPanel.empty();
		$('#journal_name h3').text("");
		$('#foo').show();
		hideControlButton();
		editTool.hide().unbind('click');
		target.find('#release_status').css('visibility','hidden');
	};
	
	var refreshInterface=function(group_id){
		if(DataStatus.isOwner){
			target.find('#release_status').css('visibility','visible');
			editTool.show().click(function(){
				contentBox.clickEditPost(group_id,$('.trip_point_group:[data-id='+group_id+'] .point:first').data('id'));	
			});
			if(DataStatus.isPublic[group_id]){
				target.find('#release_status_text').text('已發布');
			}else{
				target.find('#release_status_text').text('草稿');
			}
		}
	};
	
	var loadJournalTitle=function(g_item){
		var journal_name=g_item.find('.journal_title a').text();
		$('#journal_name h3').text(journal_name);
	};
	
	var loadContent=function(g_item){
		var tpList=g_item.find('.point');
		var str='';
		
		for(var i=0; i<tpList.length;i++){
			var id=tpList.eq(i).data('id');
			str+='<div class="tp_box" id="tp_box_'+id+'" data-id="'+id+'" >';
			str+=DataStatus.contentList[id];
			str+='</div>';
		}
		
		$(str).appendTo(contentPanel);
	};
	
	var hideJournalSwitchToggle=function(){
		journalSwitchToggle.css('visibility','hidden');
	};

	var showJournalSwitchToggle=function(){
		journalSwitchToggle.css('visibility','visible');
	};
	
	var showControlButton=function(){
		controlButton.show();
	};
	
	var hideControlButton=function(){
		controlButton.hide();
	};
	
	var hideContentPanel=function(){
		contentPanel.css('visibility','hidden');
	};
	
	var showContentPanel=function(){
		contentPanel.css('visibility','visible');
	};
	
	var setPrivate=function(){
		Data.setGroupPrivate(show_group_id,function(result){
			$('#release_status_text').text('草稿');
			DataStatus.isPublic[show_group_id]=false;
			releaseButtons.hide();
			draftButtons.show();
		});
	};
	
	var setPublic=function(){
		Data.setGroupRelease(show_group_id,function(result){
			$('#release_status_text').text('已發佈');
			DataStatus.isPublic[show_group_id]=true;
			releaseButtons.show();
			draftButtons.hide();
		});
	};
	
	var exitEditor=function(){
		hideControlButton();
		editTool.show();
		showContentPanel();
		
		var showingGroupItem=groupItemManager.getSelectedGroupItem();
		var tpList=showingGroupItem.find('.point');
		
		for(var i in editor){
			if(editor[i]){
				editor[i].setReadOnly(true);
				editor[i].destroy();
			}
		}
		var list = $('#postContent .tp_box');
		for(var i in list){
			list.eq(i).attr('contenteditable',null);
		}
		editor=[];
		
		contentPanel.empty()

		loadContent(showingGroupItem);
		$('#journal').scroll(detectScrollOnWhichPost);
		
		edit_id=null;
		edit_group_id=null;
		
		window.onbeforeunload=null;
	};

	var saveJournal=function(){
		contentPanel.find('img').resize_by_drag('destroy').unbind('click');
		for(var id in editor){
			var str=editor[id].getData().replace(/.*<span style="display: none;">&nbsp;<\/span><\/div>/,'');
			if(!DataStatus.contentList){
				DataStatus.contentList=[];
			}
			DataStatus.contentList[id]=str;
			if(str){
				Data.savePost(id);
			}
		}
		
		Data.updateGroupPhoto(edit_group_id);
		
	};
	
	var equipEditorOnBlock=function(id,item){
		editor[id]=CKEDITOR.inline(item,{
			on:{
				focus:function(){
					editor[id].setReadOnly(false);
					tripPointList.selectTripPoint(id);
					
					contentPanel.find('img').unbind('click').click(install_resize);
					$('.tp_box').attr('title','');
				
				}
			},
								// Remove unnecessary plugins to make the editor simpler.
			removePlugins: 'find,flash,' +
							'forms,iframe,newpage,' +
							'smiley,specialchar,stylescombo,templates',
			height : '100%',
			toolbar : [	[ 'Undo','Redo' ],
						[ 'Link','Unlink' ],
						[ 'Image' , 'HorizontalRule'],
						['FontSize'],
						'/' ,
						[ 'Bold','Italic','Underline', 'RemoveFormat','TextColor','Font' ]
					],
			forcePasteAsPlainText:true
		});
	};
	
	var focusPost=function(tp_box){
		$('#journal').scrollTop(tp_box.position().top);
		//data都load完後才能估算正確的目標scrollTop
		$('#postContent img').load(function(){
			$('#journal').animate({scrollTop:tp_box.position().top},1000);				  
		});
	};
	
	var focusEditPost=function(tp_box){
		focusPost(tp_box);
		tp_box.focus();
	};
	
	var detectScrollOnWhichPost=function(){	 
		var pos=$('#journal').scrollTop();
		var id;
		var list=contentPanel.find('.tp_box');
		var posBase=0;
		for(var i=0;i<list.length;i++){
			if(i==0)
					posBase=list.eq(0).position().top;
			if(list.eq(i).position().top>pos){
					break;
			}else{
				id=list.eq(i).data('id');
			}
		}
		if(edit_group_id==null){
			tripPointList.selectTripPoint(id);
		}
	};
	
	var UiListener={

		clickJournalSwitchToggle:function(){
			if(isBounce()){
				readJournal_s=false;
				collapse();
				var id=tripPointItemManager.getSelectedTripPointId();
				if(id){
					PathOnMap.centerTripPointOnAllMap(id);
					PathOnMap.showBeforeReadBubble(id);
				}else{
					var group_id=groupItemManager.getSelectedGroupId();
					PathOnMap.centerGroupOnMap();
				}
			}else{
				readJournal_s=true;
				bounce();
				var id=tripPointItemManager.getSelectedTripPointId();
				if(id){
					PathOnMap.centerTripPointOnLeftMap(id);
					PathOnMap.showTripPointInfo(id);
				}else{
					var point=$('.point:first .point_name');										
					if(point.length>0)
						point.click();
					else{
						if(!show_group_id)
							show_group_id=$('.trip_point_group:first').data('id');
						moduleInstance.UiControl.showBlankContentBox(show_group_id);
						
					}
				}
				
				tipInstance.show(6);
				tipInstance.disable();				
			}
		},
		
		//按下編輯遊記
		clickEditPost:function(group_id,id){
			edit_id=id;
			edit_group_id=group_id;
			show_group_id=group_id
			
			$('#journal').unbind('scroll');
			
			if(DataStatus.isPublic[group_id]){
				releaseButtons.show();
			}else{
				draftButtons.show();
			}
			showControlButton();
			editTool.hide();
			
			var list=target.find('.tp_box');
			for(var i=0; i<list.length; i++){
				(function(){
					var id = list.eq(i).data('id')
					list.eq(i).attr('contenteditable',true);
					equipEditorOnBlock(id,list[i]);
				}());
			}
			
			if(list.length==0){
				contentPanel.append('<div class="noPointMsg">-----------------請先加入景點-----------------</div>');
			}
			
			for(var i=0; i<list.length; i++){
				if(i%2){
					list.eq(i).addClass('red');
				}else{
					list.eq(i).addClass('green');
				}
			}
			
			var pointList=$('.trip_point_group:[data-id='+group_id+'] .point_name');
			for(var i=0; i<pointList.length; i++){
				if(i%2){
					pointList.eq(i).addClass('red_box');
				}else{
					pointList.eq(i).addClass('green_box');
				}
			}
			focusEditPost($('.tp_box:[data-id='+edit_id+']'));
			
			window.onbeforeunload=function(){
				return "您還沒儲存編輯中的遊記喔!"; 
			}; 
		},
		clickCancelEdit:function(){
			if(window.confirm('確定放棄編輯內容?') == false){	
				return false;
			}	
			exitEditor();
			return true;
		},
		clickFinishPost:function(){
			saveJournal();
			exitEditor();
		},
		clickReleasePost:function(){
			setPublic();
			saveJournal();
			exitEditor();
		},
		clickConvertToDraft:function(){
			setPrivate();
			saveJournal();
			exitEditor();
		},
		clickSetPublic:function(){
			setPublic();			
		},
		clickSetPrivate:function(){	
			setPrivate();
		}
	};
	
	
	journalSwitchToggle.click(UiListener.clickJournalSwitchToggle);
	
	finishPost.click(UiListener.clickFinishPost);
	releasePost.click(UiListener.clickReleasePost);
	cancelEdit.click(UiListener.clickCancelEdit);
	toDraft.click(UiListener.clickConvertToDraft);
	
	target.find('.public_button').click(function(){
										$('#release_status_text').click();
										UiListener.clickSetPublic();
									});
	target.find('.private_button').click(function(){
										$('#release_status_text').click();
										UiListener.clickSetPrivate();
									});
									
	target.find('#share_journal').click(function(){
		postToWall('http://www.wanderworld.com.tw/'+DataStatus.trip_id+'/'+DataStatus.group_id);
	});
	
	return{
		init:function(){
			moduleInstance=this;
		},
		initJavascript:function(){
			editTool.click(function(){
				var id=$('.trip_point_group:[data-id='+show_group_id+'] .point:first').data('id');
				moduleInstance.clickEditPost(show_group_id,id);	
			});
			$('#journal').scroll(detectScrollOnWhichPost);
		},
		ownerModeSwitch:function(){
			if(DataStatus.isOwner){
				editTool.show();
			}else{
				editTool.hide();
			}
		},
		isEditing:function(){
			if(edit_group_id){
				return true;
			}
			return false;
		},
		UiControl:{
			hide:function(){
				collapse();
				hideJournalSwitchToggle();
			},
			hideContent:function(){
				if(isBounce())
					collapse();
			},
			showJournalSwitchToggle:function(){
				showJournalSwitchToggle();
			},
			showBlankContentBox:function(group_id){
				//show_group_id=group_id;
				readJournal_s=true;
				initInterface();
				var g_item=$('.trip_point_group:[data-id='+group_id+']');
				loadJournalTitle(g_item);
				contentPanel.empty();
				bounce();
				hideControlButton();
				editTool.unbind('click');
				$('#foo').hide();
										
			},
			showContent:function(group_id,id,callback){
				if(group_id==show_group_id){
					if(id){
						var t=$('.tp_box:[data-id='+id+']');
						if(edit_id){
							focusEditPost(t);
						}else{														
							focusPost(t);
						}
					}else{
						$('#journal').scrollTop(0);
					}
					if(callback)
						callback();
				}else{
					initInterface();
					show_group_id=group_id;
					Data.loadPost(group_id,function(result){
						var g_item=$('.trip_point_group:[data-id='+group_id+']');
						loadJournalTitle(g_item);
						loadContent(g_item,result);
						$('#foo').hide();
						showContentPanel();
						
						refreshInterface(group_id);
						$('#journal').scroll(detectScrollOnWhichPost);
						moduleInstance.UiControl.showContent(group_id,id,callback);
					});		
				}
			},
			setEditFocus:function(id){
				var t=$('.tp_box:[data-id='+id+']');
				focusEditPost(t);
			},
			reLayout:function(){
				
			}
		},
		//給trippointList的groupEdit上的editPost按鈕用
		clickEditPost:function(group_id,id){
			moduleInstance.UiControl.showContent(group_id,id,function(){
				UiListener.clickEditPost(group_id,id);
			});
		},
		//更改遊記框上方title
		setGroupTitle:function(str){
			target.find('#journal_name h3').text(str);
		},
		reset:function(){
			show_group_id=null;
		},
		cancelEditWarning:function(group_id,callback){
			if(edit_group_id && edit_group_id!=group_id){
				if(!UiListener.clickCancelEdit())
					return;
			}
			if(callback){
				callback();
			}
		},
		insertNewPoint:function(group_id){
			if(edit_group_id&&edit_group_id==group_id){
				$('.noPointMsg').remove();
				var tpList=$('.trip_point_group:[data-id='+group_id+'] .point');
				var i=tpList.length-1;
				var point=tpList.last();
				var id=point.data('id');
				DataStatus.contentList[id]='';
				
				var str='<div class="tp_box" id="tp_box_'+id+'" data-id="'+id+'"></div>';
				
				var tmp=$(str).appendTo(contentPanel);

				if(i%2){
					point.find('.point_name').addClass('red_box');
					tmp.addClass('red');
				}else{
					point.find('.point_name').addClass('green_box');
					tmp.addClass('green');
				}
				
				tmp.attr('contenteditable',true);
				equipEditorOnBlock(id,tmp[0]);

				
			}else if(show_group_id==group_id){
				var group=$('.trip_point_group:[data-id='+group_id+']');
				var points=group.find('.point');
				var point=points.last();
				var id=point.data('id');
				
				DataStatus.contentList[id]='';

				var str='<div class="tp_box" id="tp_box_'+id+'" data-id="'+id+'"></div>';
				contentPanel.append(str);
			}
			
		},
		deleteGroup:function(group_id){
			if(show_group_id==group_id){
				if(edit_group_id==group_id){
					UiListener.clickCancelEdit();
				}
				moduleInstance.UiControl.hide();
			}
		},
		deleteTripPoint:function(group_id,id){
			if(show_group_id==group_id){
				target.find('#tp_box_'+id).remove();
				if(edit_group_id==group_id){
					var pointList=$('#trip_point_group_'+edit_group_id+' .point_name');
					for(var i=0; i<pointList.length; i++){
						pointList.eq(i).removeClass('red_box');
						pointList.eq(i).removeClass('green_box');
						if(i%2){
							pointList.eq(i).addClass('red_box');
						}else{
							pointList.eq(i).addClass('green_box');
						}
					}
					
					var postList=target.find('.tp_box');
					for(var i=0; i<postList.length; i++){
						postList.eq(i).removeClass('red');
						postList.eq(i).removeClass('green');
						if(i%2){
							postList.eq(i).addClass('red');
						}else{
							postList.eq(i).addClass('green');
						}
					}
				}
			}
		},
		changeTripPointOrder:function(group_id,new_group_id){
			var g_id;
			if(show_group_id==group_id){
				g_id=group_id;
			}else if(show_group_id==new_group_id){
				g_id=new_group_id;
			}
			if(g_id){
				
				for(var i in DataStatus.tripPointList){
					if(DataStatus.tripPointList[i].group_id==g_id){
					
						var t=contentPanel.find('#tp_box_'+DataStatus.tripPointList[i].id);
						
						if(t.length==0){
							Data.loadOnePost(DataStatus.tripPointList[i].id,function(){
								var id=DataStatus.tripPointList[i].id;
								var str='';
								str+='<div class="tp_box" id="tp_box_'+id+'">';
								str+=DataStatus.contentList[id];
								str+='</div>';
								var tmp=$(str).appendTo(contentPanel);
							
								if(edit_group_id==g_id){
									tmp.attr('contenteditable',true);
									editor[id]=CKEDITOR.inline(tmp[0],{
										on:{
											focus:function(){
												editor[id].setReadOnly(false);
												tripPointList.UiControl.selectTripPoint($('.trip_point_all li[value='+id+'] .point_name'));
												
												contentPanel.find('img').unbind('click').click(install_resize);
												$('.tp_box').attr('title','');
											
											}
										},
															// Remove unnecessary plugins to make the editor simpler.
										removePlugins: 'find,flash,' +
														'forms,iframe,newpage,' +
														'smiley,specialchar,stylescombo,templates',
										height : '100%',
										toolbar : [	[ 'Undo','Redo' ],
													[ 'Bold','Italic','Underline', 'RemoveFormat' ] ,
													[ 'TextColor','BGColor','Font','FontSize'],
													[ 'Link','Unlink' ],
													//'/' , 
													[ 'Image' , 'HorizontalRule' ,'Maximize']
												],
										forcePasteAsPlainText:true
									});		
								}
								
								moduleInstance.changeTripPointOrder(g_id);
							});
							return;
						}
						t.appendTo(contentPanel);
					}
				}
				var t=contentPanel.find('.tp_box:first');
				var v=t.attr('id').split('_box_')[1];
				for(var k=0; k < DataStatus.tripPointList.length; k++){
					if(DataStatus.tripPointList[k].id==v){
						if(DataStatus.tripPointList[k].group_id!=g_id){
							t.remove();
						}
						break;
					}
				}
				
				if(edit_group_id==group_id){
					var pointList=$('#trip_point_group_'+edit_group_id+' .point_name');
					for(var i=0; i<pointList.length; i++){
						pointList.eq(i).removeClass('red_box');
						pointList.eq(i).removeClass('green_box');
						if(i%2){
							pointList.eq(i).addClass('red_box');
						}else{
							pointList.eq(i).addClass('green_box');
						}
					}
					
					var postList=target.find('.tp_box');
					for(var i=0; i<postList.length; i++){
						postList.eq(i).removeClass('red');
						postList.eq(i).removeClass('green');
						if(i%2){
							postList.eq(i).addClass('red');
						}else{
							postList.eq(i).addClass('green');
						}
					}
				}
				
			}
		},
		bounce:function(){
			bounce();
		},
		collapse:function(){
			collapse();
		},
		isShow:function(){
			if(show_group_id!=null)
				return true;
			return false;
		},
		setShowGroupId:function(id,isPublic){
			show_group_id=id;
			if(!DataStatus.isPublic)
				DataStatus.isPublic=[];
			DataStatus.isPublic[show_group_id]=isPublic;
		},
		getShowGroupId:function(){
			return show_group_id;
		}
	};
};
