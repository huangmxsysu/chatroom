$(function () {
    var content = $('#content');
    var status = $('#status');
    var input = $('#input');
    var myName = false;

    var socket = io.connect('http://localhost:3000');
    
	    //收到server的连接确认
	    socket.on('open',function(){
	        status.text('Choose a name:');
	    });

    	socket.on('message',function(obj){
    		//obj{ text author time color }
    		var template = '<p><span style="color:'+obj.color+'">'+obj.author+'</span>'+obj.time+' @ ' + obj.text + '</p>';
    		content.prepend(template);
    	});

    	socket.on('system',function(obj){
    		//obj{ text author type time color}
    		var template = "";
    		if( obj.type == "welcome" ){
    			if(myName == obj.text){
    				status.text(myName + ': ').css('color', obj.color);
    			}
    		    template = '<p style="background:'+obj.color+'">system  @ '+ obj.time+ ' : Welcome ' + obj.text +'</p>';
    		}
    		else if(obj.type == 'disconnect'){
            	template = '<p style="background:'+obj.color+'">system  @ '+ obj.time+ ' : Bye ' + obj.text +'</p>';
        	}
        	content.prepend(template);
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
	            }
	        }
	    });

});


    