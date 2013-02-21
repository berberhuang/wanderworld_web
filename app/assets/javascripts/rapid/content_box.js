
var ContentBoxModule = function(item){
	var target=$(item);
	var contentPanel=target.find('#postContent');
	var editPanel=target.find('#editPostDiv');
	var controlButton = target.find('.controlButton');
	var editTool = target.find('.editTool');
	var bounce=$('#bounce');
	var collapse=target.find('#collapse');
	var releasePost=target.find('#releasePost');
	var finishPost=target.find('#finishPost');
	var cancelEdit=target.find('#cancelEdit');
	
	var editor=[];	
	
	var edit_id;
	var edit_group_id;
	var show_id;
	var show_group_id;
	
	var bounce_s=false;
	
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
	
	var UiListener={
		//展開遊記
		clickBounce:function(){
			if(bounce_s){
				return;	
			}
			bounce_s=true;
			PathOnMap.closeInfoWindow();
			//target.animate({width:$(document).width()-390},15);
			target.css({width:$(document).width()-390});
			moduleInstance.UiControl.hideBounceButton();
			
		},
		//收合遊記
		clickCollapse:function(stopShow){
			if(!bounce_s){
				return;
			}
			bounce_s=false;
			moduleInstance.UiControl.showBounceButton();
						
			target.animate({width:'0px'},500);
		},
		//按下編輯遊記
		clickEditPost:function(group_id,id){
			edit_id=id;
			edit_group_id=group_id;
			controlButton.show();
			if(DataStatus.isPublic[group_id]){
				releasePost.hide();
			}else{
				releasePost.show();
			}
			
			var list=target.find('.tp_box');
			for(var i=0; i<list.length; i++){
				(function(){
					var id = list.eq(i).attr('id').split('_box_')[1];
					list.eq(i).attr('contenteditable',true);
					editor[id]=CKEDITOR.inline(list[i],{
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
			
			var pointList=$('#trip_point_group_'+group_id+' .point_name');
			for(var i=0; i<pointList.length; i++){
				if(i%2){
					pointList.eq(i).addClass('red_box');
				}else{
					pointList.eq(i).addClass('green_box');
				}
			}
			moduleInstance.UiControl.setEditFocus(id);
			//$('.tp_box').click(function(event){
				//console.log(event);
				//debug=event;
				//alert($(event.target).attr('id'));
				//var id=$(event.target).attr('id').split('_box_')[1];
				//tripPointList.UiControl.selectTripPoint($('.trip_point_all li[value='+id+'] .point_name'));				
			//})
			
			//CKEDITOR.instances.editPost.setData(DataStatus.contentList[id]);
			/*if(!pointData[edit_menu_id])
				return;
			var points=$('#trip_point_group_'+pointData[edit_menu_id].group_id+' li');
			var k=1;
			for(var i=0;i<points.length;i++){
				if(!pointData[edit_menu_id].post_simple){
						loadPost(pointData[edit_menu_id].group_id,function(){
						editing=true;
						ui_editPost(edit_menu_id);
						ui_unloadTripPointSwitchControl(true);
					});
					k=0;
					break;
				}
			}
			if(k){
				editing=true;
				ui_editPost(edit_menu_id);			
				ui_unloadTripPointSwitchControl(true);
			}*/
			//showContainer();
		},
		clickCancelEdit:function(){
			editPanel.hide();
			controlButton.hide();
			contentPanel.show();
			
			
			for(var i in editor){
				editor[i].setReadOnly(true);
				editor[i].destroy();
			}
			var list = $('#postContent .tp_box');
			for(var i in list){
				list.eq(i).attr('contenteditable',null);
			}
			editor=[];
			
			var tpList=DataStatus.tripPointList;
			var str='';
			for(var i in DataStatus.groupList){
				if(DataStatus.groupList[i].id==show_group_id){
					str+='<div class="postTitle">'+DataStatus.groupList[i].title+'</div>';
					break;
				}
			}
			for(var i=0; i<tpList.length;i++){
			if(tpList[i].group_id==show_group_id){
				str+='<div class="tp_box" id="tp_box_'+tpList[i].id+'">';
				str+=DataStatus.contentList[tpList[i].id];
				str+='</div>';
				}
			}
					
			
			contentPanel.empty().append(str);
			
			var pointList=$('#trip_point_group_'+edit_group_id+' .point_name');
			for(var i=0; i < pointList.length; i++){
				pointList.eq(i).removeClass('red_box');
				pointList.eq(i).removeClass('green_box');
			}

			
			edit_id=null;
			edit_group_id=null;
		},
		clickFinishPost:function(){
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
				
			UiListener.clickCancelEdit();
			
			
			//setGroupRelease(pointData[editTarget_id].group_id);

			//if($('#postToFB input').attr('checked')!=null){
			//	FB.ui({method:'feed',link:'http://wanderworld.com.tw/'+trip_id+'/'+pointData[editTarget_id].tripPoint_id,name:trip_name+'-'+$('#trip_point_group_'+pointData[editTarget_id].group_id+' .trip_point_title a').text(),description:pointData[editTarget_id].post_simple,picture:"<%='http://wanderworld.com.tw'+asset_path('view_all.png')%>"});
			//}
		},
		clickReleasePost:function(){
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
			
			Data.setGroupRelease(edit_group_id);
			DataStatus.isPublic[edit_group_id]=true;
			target.find('#notpublic').hide();
			target.find('#public').show();
			
			UiListener.clickCancelEdit();
		}
	};
	
	
	bounce.click(UiListener.clickBounce);
	collapse.click(function(){
		UiListener.clickCollapse();
		PathOnMap.showMarkInfo(show_id);
	});
	
	
	finishPost.click(UiListener.clickFinishPost);
	releasePost.click(UiListener.clickReleasePost);
	cancelEdit.click(UiListener.clickCancelEdit);
	
	return{
		init:function(){
			moduleInstance=this;
			target.css('width','0px');
			target.show();
			//target.append('');
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
				UiListener.clickCollapse();
				bounce.hide(500);
			},
			showBounceButton:function(){
				bounce.show(500);
			},
			hideBounceButton:function(){
				bounce.hide(500);
			},
			hideContent:function(){
				if(bounce_s)
					UiListener.clickCollapse();
			},
			showContent:function(group_id,id,callback){
				show_id=id;
				if(group_id==show_group_id){
					UiListener.clickBounce();
					if(id){
						var t=$('#tp_box_'+id);
						
						$('#journal').scrollTop(t.position().top-$('#postContent').position().top,100);
						//data都load完後才能估算正確的目標scrollTop
						$('#postContent img').load(function(){
							 $('#journal').scrollTop(t.position().top-$('#postContent').position().top,100);				  
						});
						
						if(edit_id!=null)
							editor[id].focus();
							
						PathOnMap.centerOnTripPoint(id);
					}else{
						$('#journal').scrollTop(0);
					}
					
					PathOnMap.closeInfoWindow();
					moduleInstance.ownerModeSwitch();
					contentBox.UiControl.reLayout();
					if(callback)
						callback();
					return ;
				}
				
				show_group_id=group_id;
				
				UiListener.clickBounce();
				editPanel.hide();
				controlButton.hide();
				editTool.unbind('click').click(function(){UiListener.clickEditPost(group_id,id);});
				
				$('#foo').show();
				contentPanel.empty();
				Data.loadPost(group_id,function(result){
					$('#foo').hide();
					contentPanel.show();
					
					var tpList=DataStatus.tripPointList;
					var str='';
					
					for(var i in DataStatus.groupList){
						if(DataStatus.groupList[i].id==group_id){
							str+='<div class="postTitle">'+DataStatus.groupList[i].title+'</div>';
							break;
						}
					}

					for(var i=0; i<tpList.length;i++){
						if(tpList[i].group_id==group_id){
							str+='<div class="tp_box" id="tp_box_'+tpList[i].id+'">';
							str+=DataStatus.contentList[tpList[i].id];
							str+='</div>';
						}
					}
					
					$(str).appendTo(contentPanel);
					$('#journal').scroll(function(){
						var pos=$('#journal').scrollTop();

						var id;
						var list=contentPanel.find('.tp_box');
						var posBase=0;
						for(var i=0;i<list.length;i++){
							if(i==0)
								posBase=list.eq(0).position().top;
							if(list.eq(i).position().top-posBase>pos){
								break;
							}else{
								id=list.eq(i).attr('id').split('_box_')[1];
							}
						}
						if(edit_group_id==null){
							tripPointList.UiControl.selectTripPoint($('.trip_point_all li[value='+id+'] .point_name'));						
						}
					});
					
					if(DataStatus.isPublic[group_id] || !DataStatus.isOwner){
						target.find('#notpublic').hide();
						var t=target.find('#public').hide();
						if(DataStatus.isOwner){
							t.show();
						}
					}else{
						target.find('#notpublic').show();
						target.find('#public').hide();
					}
					
					moduleInstance.UiControl.showContent(show_group_id,show_id,callback);	
				});
				
			},
			setEditFocus:function(id){
				var t=$('#tp_box_'+id);
				$('#journal').animate({scrollTop:t.position().top-$('#postContent>div:eq(0)').position().top},500,function(){
					t.focus();
				});
			},
			reLayout:function(){
				//遊記框高度
				if(bounce_s){
					//bounce.hide();
					//$('#collapse').show();		
					//$('#slidesContainer').css('height',$(document).height()-$('.header').height());
					//$('#slide_main').css('height',$(document).height()-$('.header').height()-40);
					//$('.cke_editor').css('height',$(document).height()-$('.header').height()-40-15);
					target.width($(document).width()-390);
					
				}
				$('.control').css('line-height', $(document).height()-$('.header').height()-40 +'px');
				$('#foo').css('top',$('#journal').height()/2+30);
				//遊記框位置
				//var Container_r = 260 + ($(document).width()- 1280)/2  ;
				//$('#slidesContainer').css('right',Container_r);
				//$('#slidesContainer_s').css('right',Container_r);
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
			target.find('.postTitle').text(str);
		},
		cancelEdit:function(){
			if(edit_group_id){
				UiListener.clickCancelEdit();
			}
		},
		//isBounce:function(){
		//	if(bounce_s)
		//		return true;
		//	return false;
		//},
		reset:function(){
			show_id=null;
			show_group_id=null;
		},
		cancelEditWarning:function(group_id,callback){
			if(edit_group_id && edit_group_id!=group_id){
				$( "#dialog" ).dialog({
				  resizable: false,
				  height:140,
				  modal: true,
				  buttons: {
					"放棄儲存": function() {
					  $( this ).dialog( "close" );
					  moduleInstance.cancelEdit();
					  if(callback)
						callback();
					},
					Cancel: function() {
					  $( this ).dialog( "close" );
					}
				  }
				});			
			}else{
				if(callback){
					callback();
				}
			}
		},
		insertNewPoint:function(group_id){
			if(edit_group_id&&edit_group_id==group_id){
				$('.noPointMsg').remove();
				var tpList=$('#trip_point_group_'+group_id+' .trip_point li');
				var i=tpList.length-1;
				var point=tpList.last();
				var id=point.val();
				DataStatus.contentList[id]='';
				
				var str='<div class="tp_box" id="tp_box_'+id+'"></div>';
				
				var tmp=$(str).appendTo(contentPanel);

				if(i%2){
					point.find('.point_name').addClass('red_box');
					tmp.addClass('red');
				}else{
					point.find('.point_name').addClass('green_box');
					tmp.addClass('green');
				}
				
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
				
			}else if(show_group_id==group_id){
				var point=$('#trip_point_group_'+group_id+' .trip_point li:last');
				var id=point.val();
				DataStatus.contentList[id]='';
				var str='<div class="tp_box" id="tp_box_'+id+'"></div>';
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
		isShow:function(){
			if(show_group_id!=null)
				return true;
			return false;
		}
	};
};
