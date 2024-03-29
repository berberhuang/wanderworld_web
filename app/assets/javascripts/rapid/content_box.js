
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
	
	var journal=target.find('#journal');
	var header_height;	

	editor=[];

	var edit_id;
	var show_id;
	var edit_group_id;
	var show_group_id=null;
	var select_id=null;
	
	var moduleInstance;

	
	var onlineData=[];


	var getScrollTop=function(){
		var top=target.scrollTop()-header_height;
		if(top<0){
			return 0;	
		}else{
			return top;
		}
	};

	var setScrollTop=function(p){
		if(p!=0)
			target.scrollTop(header_height+p);
		else
			target.scrollTop(0);
	};

	var isBounce=function(){
		if(target.css('z-index')==-1){
			return false;
		}
		return true;
	};
	
	//展開遊記	
	var bounce=function(){		
		readJournal_s=true;
		target.css('z-index','0');			
		setTitle($('.trip_point_group:[data-id='+show_group_id+'] .journal_title a').text()+' - WanderWorld地球漫遊');
	};
	//收合遊記
	var collapse=function(stopShow){
		if(edit_group_id){
			if(window.confirm('確定放棄編輯內容?') == false){	
				return false;
			}	
			exitEditor();
		}
		readJournal_s=false;
		target.css('z-index','-1');
		setTitle(DataStatus.trip_name+' - WanderWorld地球漫遊');
		return true;
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
		$('#journal_name h3').text(journal_name).attr('title',journal_name);
		setTitle(journal_name+' - WanderWorld地球漫遊');
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
		
		$(str).appendTo(contentPanel).find('img').attr('onerror','this.src="/assets/photo_deleted.gif"');
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
		target.scroll(detectScrollOnWhichPost);
		
		edit_id=null;
		edit_group_id=null;
		
		window.onbeforeunload=null;
	};

	var saveJournal=function(){
		$('#saving').show();
		var saveList=[];
		for(var id in editor){
			var str=editor[id].getData().replace(/.*<span style="display: none;">&nbsp;<\/span><\/div>/,'');
			if(!DataStatus.contentList){
				DataStatus.contentList=[];
			}
			if(DataStatus.contentList[id]!=str){
				DataStatus.contentList[id]=str;
				saveList.push(id);
			}
		}
		
		for(var i=0;i<saveList.length;i++){
			var id=saveList[i];
			if(i==saveList.length-1){
			    var journal_id=edit_group_id;
			    Data.savePost(id,function(result){
				if(result){
					Data.updateGroupPhoto(journal_id,function(){
						$('#saving').hide();
						exitEditor();
					});
				}else{
					alert("儲存失敗,可能您的網路中斷或我們伺服器出了問題,請稍後在試");
					$('#saving').hide();
				}
			    });
			}else{
			    Data.savePost(id);
			}
		}
		if(saveList.length==0){
			$('#saving').hide();
			exitEditor();
		}
	};
	
	var equipEditorOnBlock=function(id,item){
		editor[id]=CKEDITOR.inline(item,{
			on:{
				focus:function(){
					editor[id].setReadOnly(false);
					tripPointList.selectTripPoint(id);
					
					PathOnMap.centerTripPointOnLeftMap(id);
					PathOnMap.showTripPointInfo(id);
					edit_id=id;
					$('.tp_box').attr('title','');
				
				}
			},
								// Remove unnecessary plugins to make the editor simpler.
			removePlugins: 'find,flash,image,' +
							'forms,iframe,newpage,' +
							'smiley,specialchar,stylescombo,templates',
			extraPlugins: 'customimage',
			height : '100%',
			toolbar : [	[ 'Undo','Redo' ],
						[ 'Link','Unlink' ],
						[ 'CustomImage' , 'HorizontalRule'],
						['FontSize'],
						'/' ,
						[ 'Bold','Italic','Underline', 'RemoveFormat','TextColor','Font' ]
					],
			forcePasteAsPlainText:true
		});
	};
	
	var focusPost=function(tp_box){
		setTimeout(function(){setScrollTop(tp_box.position().top);},500);
	};
	
	var focusEditPost=function(tp_box){
		focusPost(tp_box);
		tp_box.focus();
	};
	
	var detectScrollOnWhichPost=function(){	 
		if(edit_group_id){
			return ;
		}
		var pos=getScrollTop();
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
		
		if(select_id){
			tripPointList.selectTripPoint(select_id);
			select_id=null;
		}else if(edit_group_id==null){
			if(show_id!=id){
				tripPointList.selectTripPoint(id);
				PathOnMap.centerTripPointOnLeftMap(id);
				PathOnMap.showTripPointInfo(id);
				show_id=id;
			}
		}
	};
	
	var UiListener={

		clickJournalSwitchToggle:function(){
			if(isBounce()){
				if(!collapse()){
					return;
				}
				var id=tripPointItemManager.getSelectedTripPointId();
				if(id){
					PathOnMap.centerTripPointOnAllMap(id);
					PathOnMap.showBeforeReadBubble(id);
				}else{
					var group_id=groupItemManager.getSelectedGroupId();
					PathOnMap.centerGroupOnMap();
				}
			}else{
				bounce();
				var id=tripPointItemManager.getSelectedTripPointId();
				if(id){
					$('.point:[data-id='+id+'] .point_name').click();
				}else{
					var point;
					if(show_group_id){
						point=$('.trip_point_group:[data-id='+show_group_id+'] .point:first .point_name');
					}else{
						point=$('.point:first .point_name');
					}										
					if(point.length>0){
						point.click();
					}else{
						if(!show_group_id)
							moduleInstance.UiControl.showBlankContentBox($('.trip_point_group:first').data('id'));		
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
			
			journal.unbind('scroll');
			
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
		},
		clickReleasePost:function(){
			setPublic();
			saveJournal();
		},
		clickConvertToDraft:function(){
			setPrivate();
			saveJournal();
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
	/*								
	target.find('#share_journal').click(function(){
		postToWall('http://www.wanderworld.com.tw/'+DataStatus.trip_id+'/'+DataStatus.group_id);
	});
	*/
	
	return{
		init:function(){
			moduleInstance=this;
			header_height=$('#journal_cc_1st_stack').height()+$('#journal_cc_2nd_stack').height()+12;  //12 is height of hr	
		},
		initJavascript:function(){
			editTool.click(function(){
				var id=$('.trip_point_group:[data-id='+show_group_id+'] .point:first').data('id');
				moduleInstance.clickEditPost(show_group_id,id);	
			});
			
			target.scroll(detectScrollOnWhichPost);
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
				if(!collapse())
					return false;
				hideJournalSwitchToggle();
				return true;
			},
			hideContent:function(){
				if(isBounce()){
					if(!collapse())
						return false;
				}
				return true;
			},
			showJournalSwitchToggle:function(){
				showJournalSwitchToggle();
			},
			showBlankContentBox:function(group_id){
				show_group_id=group_id;
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
						select_id=id;
					}else{
						setScrollTop(0);
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
						target.scroll(detectScrollOnWhichPost);
						addLike();
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
			target.find('#journal_name h3').text(str).attr('title',str);
			setTitle(str+' - WanderWorld地球漫遊');
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
				PathOnMap.closeInfoWindow();
				collapse();
			}
			if($('.trip_point_group').length==0){
				hideJournalSwitchToggle();
			}
		},
		deleteTripPoint:function(group_id,id){
			if(show_group_id==group_id){
				target.find('#tp_box_'+id).remove();
				if(edit_group_id==group_id){
					var pointList=$('.trip_point_group:[data-id='+edit_group_id+'] .point_name');
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
				if($('.trip_point_group:[data-id='+show_group_id+'] .point').length==0){
					hideControlButton();
					editTool.hide().unbind('click');
					target.find('#release_status').css('visibility','hidden');
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
			return collapse();
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
		},
		getEditTripPointId:function(){
			return edit_id;
		}
	};
};
