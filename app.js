var express =require('express');
var app = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

var io = require('socket.io').listen(app);
var rooms = [];

function room(roomSocket, roomId){
  this.roomSocket = roomSocket;
  this.roomId = roomId;
  this.mobileSockets = [];
};


app.listen(8080);

io.sockets.on('connection', function (socket) {

  socket.on("new room", function(data){
    rooms.push(new room(socket, data.room));
  });

  socket.on("connect mobile", function(data, fn){
    var desktopRoom = null;
    for(var i = 0; i < rooms.length; i++){
      if(rooms[i].roomId == data.room){
        desktopRoom = i;
      }
    }
    if(desktopRoom !== null){
      rooms[desktopRoom].mobileSockets.push(socket);
      socket.set('roomi', desktopRoom, function(){}) 
      fn({registered: true});
      rooms[socket.store.data.roomi].roomSocket.emit('add user', socket.id, data);
    }else{
      fn({registered: false, error: "No live desktop connection found"});
    }
  });

  //Update the position
  socket.on("update movement", function(data){
    if(typeof socket.store.data.roomi !== 'undefined'){
      if(typeof rooms[socket.store.data.roomi] !== 'undefined'){
        rooms[socket.store.data.roomi].roomSocket.emit('update position', socket.id, data);
      }
    }
  });


  //When a user disconnects
  socket.on("disconnect", function(){
    console.log(rooms.length);
    var destroyThis = null;

    if(typeof socket.store.data.roomi == 'undefined'){
      for(var i in rooms){
        if(rooms[i].roomSocket.id == socket.id){
          destroyThis = rooms[i];
        }
      }
      if(destroyThis !== null){rooms.splice(destroyThis, 1);}
      console.log(rooms.length);
    }else{
      var roomId = socket.store.data.roomi;
      for(var i in rooms[roomId].mobileSockets){
        if(rooms[roomId].mobileSockets[i] == socket){
          destroyThis = i;
        }
      }
      if(destroyThis !== null){rooms[roomId].mobileSockets.splice(destroyThis, 1);}
      rooms[roomId].roomSocket.emit('remove user', socket.id);
    }
  });
});
