var motionItem=new Array();
var t;
function test(){
	var dq={
		method:'fql.query',
		query:'select uid from user where uid in (select uid1 from friend where uid2=me()) AND is_app_user="true"',
		format:'json'
	};
	FB.api(dq,function(r){
                t=r;
                var i=0;
                for(;i<r.length;i++){
                        FB.api('/'+r[i].uid+'/wanderworld:create/trip?limit=6',function(r){
                                var j=0;
                                for(;j<r.data.length;j++){
					var k=motionItem.length;
					for(;k>=0;k--){
						if(r.data[j].last_time<motionItem[k]){
							if(k>=5)
								break;
							else
								insertMotionItem(r.data[j],k+1);
						}
					}
                                }
                        });
              	}
		FB.api('/me/wanderworld:create/trip?limit=6',function(r){
                        var j=0;
                        for(;j<r.data.length;j++){
				for(;k>=0;k--){
					if(r.data[j].last_time<motionItem[k]){
						if(k>=5)
							break;
						else
							insertMotionItem(r.data[j],k+1);
					}
				}
                        }
                });
        });
}
function insertMotionItem(data,i){
	var k=5;
	for(;k>i;k--){
		motionItem[k]=motionItem[k-1];
	}
	motionItem[i]=data;
}

function getFriendList(){	
	var dq={
		method:'fql.query',
		query:'select uid,name,pic from user where uid in (select uid1 from friend where uid2=me()) AND is_app_user="true"',
		format:'json'
	};
	FB.api(dq,function(r){
		getFriendTrip(r);
	});
}
