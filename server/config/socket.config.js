const shortid = require('shortid');

let openConnections = {};

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    openConnections[socket.id] = {socket: socket};
    let connection = openConnections[socket.id];
    console.log('Server socket is up');
    socket.emit('user connected');

    socket.on('message', data => {
      connection.users = [];
    });

    // incoming data should include the "user" who is requesting to create this room
    socket.on('newSinglePlayerRoom', (data) => {
      connection.users = [].push(data.user);          // add a user to the room
      let roomId = shortid.generate();
      connection.roomId = roomId;                     // attach roomId to room
      socket.join('room-' + roomId);
      // Add the new room to DB and (redis?)
      io.sockets.in('room-' + roomId).emit('roomCreated', {     // only emit to sockets in that room
        roomId: roomId
      });
    });
  });
};
