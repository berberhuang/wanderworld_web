var CommentModule = function(item){
	var target = $(item);
	var commentScope = target.find('.comment_scope');
	var inputContent=target.find('.comment_input textarea');
	var commentModel;
	
	//產生單個comment字串
	var createCommentStr=function(class_name,content,user_id,username,start_date){
		return '<div class="'+class_name+'"> \
					<div class="content">' + content + '</div> \
					<div class="footer"> \
						<a class="username" href="/rapid/triplist/'+user_id+'">'+username+'</a> \
						<span>'+start_date+'</span> \
						<div><a class="button" id="delete">刪除</a></div> \
					</div> \
				</div>';
	};
	//產生整個commentsEntity字串
	var createCommentEntity=function(content){
		if(UserData.user_id!=null){
			return '<div class="entity">\
					<div class="content_panel">'+content +'</div>\
						<div class="reply_input" style="margin-top:20px"> \
							<textarea placeholder="回覆‧‧‧‧"></textarea> \
							<input class="submit" type="button" value="回覆"></input> \
						</div>\
					</div>';
		}else{
			return '<div class="entity">\
					<div class="content_panel">'+content +'</div>\
					</div>';

		}
	};
	
	//產生置底input元件字串
	var createInputBoxStr=function(){
		return '<div class="comment_input" style="margin-top:20px">\
					<textarea></textarea>\
					<input class="submit" type="button" value="留言"></input>\
				</div>';
	};
	
	var convertGMTtoLocaleString=function(str){
		var tmp=new Date();
		var d=new Date(new Date("GMT "+str).getTime()-tmp.getTimezoneOffset()*60000);
		return d.toLocaleString();
	};
	
	var replyClick=function(e,cg_id){
		var item=$(e.target);
		item.prop('disabled',true);
		var panel=item.parents('.entity').find('.content_panel');
		var entity=item.parent();
		var content=entity.find('textarea').val();
		if(content.replace(/[\s]*/,"").length==0){
			return;
		}
		var role;
		if(UserData.user_id==DataStatus.owner_user_id){
			role="p2";
		}else{
			role="p1";
		}
		$.post('/comment/newReply',{
									group_id:DataStatus.group_id,
									commentGroup_id:cg_id,
									user_id:UserData.user_id,
									owner_user_id:DataStatus.owner_user_id,
									content:content
									},
									function(resp){
										if(resp){
											panel.append(createCommentStr(role,content,UserData.user_id,resp[1],convertGMTtoLocaleString(resp[2])));
											entity.find('textarea').val('').height('20px').next().hide();
											panel.find('#delete:last').click(
												(function(){
													var id=resp[0];
													return function(e){deleteClick(e,id)};
												}()));
										}else{
											alert('伺服器連線問題');
										}
										item.prop('disabled',false);
									});			
	};
	
	var deleteClick=function(e,id){
		if(window.confirm('您確定要刪除?') == true){	
			$.post('/comment/deleteReply',{id:id},function(resp){
				if(resp){
					var t=$(e.target);
					if(t.parents('.entity').find('.p1,.p2').length==1){
						t.parents('.entity').remove();
					}else{
						t.parent().parent().parent().remove();
					}
				}
			});
		}
	};
	
	target.hide();
	//new comment entity function
	target.find('.comment_input .submit').click(function(e){
		var button=$(e.target);
		button.prop('disabled',true);
		var role;
		if(UserData.user_id==DataStatus.owner_user_id){
			role="p2";
		}else{
			role="p1";
		}
		var content=inputContent.val();
		if(content.replace(/[\s]*/,"").length==0){
			return;
		}
		$.post('/comment/newEntity',{user_id:UserData.user_id,owner_user_id:DataStatus.owner_user_id,group_id:DataStatus.group_id,content:content},function(r){
			if(r){
				var time=convertGMTtoLocaleString(r[3]);
				commentScope.append( createCommentEntity( createCommentStr(role,content,UserData.user_id,r[2],time)));
				inputContent.val('');
				var item=commentScope.find('.entity:last');
				item.find('.reply_input .submit').click(
										(function(){
											var id=r[1];
											return function(e){replyClick(e,id);};
										}())
										);
				item.find('.reply_input textarea').unbind('focus').focus(function(e){$(e.target).height('50px').next().show();});
				item.find('#delete').click(
									(function(){
										var id=r[0];
										return function(e){deleteClick(e,id)};
									}()));
			}else{
				alert('伺服器連線問題');
			}
			button.prop('disabled',false);
		});
		
	});

	if(UserData.user_id!=null){
		target.find('.nologin').hide();
		target.find('.reply_input').show();
		target.find('.comment_input').show();
	}else{
		target.find('.nologin').show();
		target.find('.reply_input').hide();
		target.find('.comment_input').hide();
	}
	
	return {
		loadComments:function(group_id){
			target.hide();
			commentScope.empty();
			commentModel=[];
			$.get('/comment/getComments',{group_id:group_id}, function(resp){
				var r=resp[0];
				var t=resp[1];
				for(var i=0; i<r.length; i++){
					var cg_id=r[i].commentGroup_id;
					var role;
					if(r[i].user_id==DataStatus.owner_user_id){
						role="p2";
					}else{
						role="p1";
					}
					var time=convertGMTtoLocaleString(t[i]);
					if(commentModel[cg_id]==null){
						commentScope.append(createCommentEntity('')).find('.entity:last')
									.find('.reply_input .submit').click(
										(function(){
											var id=cg_id;
											return function(e){replyClick(e,id);};
										}())
										).end()
									.find('.reply_input textarea').focus(function(e){$(e.target).height('50px').next().show();});;
						commentModel[cg_id]=commentScope.find('.content_panel:last');
					}
					commentModel[cg_id].append(createCommentStr(role,r[i].content,r[i].user_id,r[i].username,time));
					if(r[i].user_id!=UserData.user_id && UserData.user_id!=DataStatus.owner_user_id){
						commentModel[cg_id].find('#delete:last').remove();
					}else{
						commentModel[cg_id].find('#delete:last').click(
												(function(){
													var id=r[i].id;
													return function(e){deleteClick(e,id)};
												}()));
					}
				}
				inputContent.val('');
				target.show();
			});
		}
	};
};
