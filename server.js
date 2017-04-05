var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	path = require('path');
	
//4.x
var favicon = require('serve-favicon')
var logger = require('morgan')
var methodOverride = require('method-override')
var session = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')
var errorHandler = require('errorhandler')



var getTime=function(){
  var date = new Date();
  return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}

var getColor=function(){
  var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
                'orange','blue','blueviolet','brown','burlywood','cadetblue'];
  return colors[Math.round(Math.random() * 10000 % colors.length)];
}


//WebSocket连接监听

io.on('connection', function (socket) {
  socket.emit('open');//通知客户端已连接
  // 构造客户端对象
  var client = {
    socket:socket,
    name:false,
    color:getColor()
  }
   // 对message事件的监听
  socket.on('message', function(msg){
  	var obj = { time:getTime() , color:client.color };

  	if(!client.name){

  		client.name = msg;
  		obj['text'] = client.name;
  		obj['type'] = 'welcome';
  		obj['author'] = '系统';

  		socket.emit('system',obj);
  		socket.broadcast.emit('system',obj);
  		console.log(client.name + ' 进入聊天室');
  	}
  	else{
  		obj['text'] = msg;
  		obj['author'] = client.name;
  		obj['type'] = 'message';
  		socket.emit('message',obj);
  		socket.broadcast.emit('message',obj);
  		console.log(client.name + ' 说: ' + msg );
  	}
  });

      //监听出退事件
    socket.on('disconnect', function () {  
      var obj = {
        time:getTime(),
        color:client.color,
        author:'系统',
        text:client.name,
        type:'disconnect'
      };

      // 广播用户已退出
      socket.broadcast.emit('system',obj);
      console.log(client.name + ' Disconnect');
    });
});

// //express基本配置
// app.configure(function(){
//   app.set('port', process.env.PORT || 3000);
//   app.set('views', __dirname + '/views');
//   app.use(express.favicon());
//   app.use(express.logger('dev'));
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(app.router);
//   app.use(express.static(path.join(__dirname, '/public')));
// });

// app.configure('development', function(){
//   app.use(express.errorHandler());
// });


//express基本配置
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
  

app.use(logger('dev'))
app.use(methodOverride())
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer())
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
  app.use(errorHandler())
}

// 指定webscoket的客户端的html文件
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname,'views/index.html'));
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



