$(function () {
    var message = $('.message');
    var status = $('#currentName h3');
    var input = $('#input');
    var myName = false;

    var socket = io.connect('http://localhost:3000');
    
	    //收到server的连接确认
	    socket.on('open',function(){
	        status.text('您的昵称');
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
            if(myName == obj.author){
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
    		var template = "";
    		if( obj.type == "welcome" ){
    			if(myName == obj.text){
    				status.text(myName).css('color', obj.color);
    			}
    		    template = '<div id = "system"><p>- - -'+obj.text + ' @ '+obj.time+' 加入聊天室 - - -</p></div>';
    		}
    		else if(obj.type == 'disconnect'){
            	template = '<div id = "system"><p>- - -'+obj.text + ' @ '+obj.time+' 离开了聊天室- - -</p></div>';
        	}
        	message.append(template);
            $('.messagebox').scrollTop($('.messagebox')[0].scrollHeight); 

    	});

    	//通过“回车”提交聊天信息
	    input.keydown(function(e) {
	        if (e.keyCode === 13) {
	            var msg = $(this).val();
	            if (!msg) return;
	            socket.emit('message',msg);
	            $(this).val('');
	            if (myName === false) {
	                myName = msg;
                    $(this).attr('placeholder','');
	            }
	        }
	    });

});


    