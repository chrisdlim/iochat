var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//arrays
users = [];
connections = [];

//run server
server.listen(process.env.PORT || 3000);
console.log('Server running. . .');

//create route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//open a connection with socketio
io.sockets.on('connection', function(socket){
  //push socket into connections array
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //disconnect
  socket.on('disconnect', function(data){
    //remove  users when disconnected
    // if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsers();

    //disconnect connection
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  //send message
  socket.on('send message', function(data){
    // console.log(data);
    //emit new msg event
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  //new user
  socket.on('new user', function(data, callback){
    // console.log(data);
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsers();
  });

  function updateUsers(){
    io.sockets.emit('get users', users);
  }
});
