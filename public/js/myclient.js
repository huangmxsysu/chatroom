$(function () {
    var message = $('.message');
    var status = $('#currentName h3');
    var input = $('#input');
    var myName = false;
    var count = $('#count h3');

    var genUid = function(){
      return new Date().getTime()+""+Math.floor(Math.random()*899+100);
    }

    var userid = genUid();


    var socket = io.connect('http://localhost:3000');
    
	    //收到server的连接确认
	    socket.on('open',function(){
	        status.text('您的昵称: []');
            input.attr('placeholder','请输入你的昵称（建议一个字母）回车');
	    });

    	socket.on('message',function(obj){
    		//obj{ text author time color }
                /*<div id = "myself">
                    <div id = "img">HK</div>
                    <div id = "content"><p>你们好啊啊</p></div>
                    <div id = "triangle-right"></div>
                </div>  */
            var template = "";
            if(myName == obj.author&&userid == obj.userid){
                template = '<div id = "myself"><div id = "img">'+obj.author+'</div>';
                template+= '<div id = "content"><p>'+obj.text+'</p></div>';
                template+= '<div id = "triangle-right"></div>';
                template+= '</div>';
            }
            else{
                template = '<div id = "others"><div id = "img">'+obj.author+'</div>';
                template+= '<div id = "content"><p>'+obj.text+'</p></div>';
                template+= '<div id = "triangle-left"></div>';
                template+= '</div>';
            }
            
    		// var template = '<p><span style="color:'+obj.color+'">'+obj.author+'</span>'+obj.time+' @ ' + obj.text + '</p>';
    		message.append(template);
            $('.messagebox').scrollTop($('.messagebox')[0].scrollHeight); 
    	});

    	socket.on('system',function(obj){
    		//obj{ text author type time color}
            var userinfo = "";
            for(item in obj.onlineUsers){
                if(obj.onlineUsers.hasOwnProperty(item)){
                    userinfo += '<li style="color:'+obj.onlineUsers[item].color+'">'+obj.onlineUsers[item].name+'</li>';

                }
            }
            // $('#userlist')[0].innerHTML='';
            $('#userlist').empty();
            $('#userlist').append(userinfo);
                        
    		var template = "";
    		if( obj.obj.type == "welcome" ){
    			if(myName == obj.obj.text){
    				status.text('我的昵称: '+ myName).css('color', obj.obj.color);
    			}
    		    template = '<div id = "system"><p>- - -'+obj.obj.text + ' @ '+obj.obj.time+' 加入聊天室 - - -</p></div>';
    		}
    		else if(obj.obj.type == 'disconnect'){
            	template = '<div id = "system"><p>- - -'+obj.obj.text + ' @ '+obj.obj.time+' 离开了聊天室- - -</p></div>';
        	}
            count.text('房间在线人数: '+obj.countUsers);
        	message.append(template);
            $('.messagebox').scrollTop($('.messagebox')[0].scrollHeight); 

    	});


        //通过“回车”提交聊天信息
	    input.keydown(function(e) {
	        if (e.keyCode === 13) {
	            var msg = $(this).val();
	            if (!msg) return;
                var msgobj = {name:msg,userid:userid};
	            socket.emit('message',msgobj);
	            $(this).val('');
	            if (myName === false) {
	                myName = msg;
                    $(this).attr('placeholder','');
	            }

	        }
	    });

});


    