const RedisController = require('../db/Redis/RedisController.js');
const friendsVsFriends = require('../game/friendsVsFriends.js');

let openConnections = {};

function addToOpenConnections (socket) {
  openConnections[socket.id] = {
    socket: socket,
    score: 0,
    name: null
  };
}

let TESTING_NUM_ROUNDS = 3;   // CHANGE THIS FOR DIFFERENT NUMBER OF ROUNDS
function messageHandler (msg, io, socket) {
  friendsVsFriends(io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket);
}

function joinRoomHandler (msg, io, socket) {
  openConnections[socket.id].name = msg.user;   // Set the user's name'
  socket.join(msg.roomId);                      // Add this socket to the room.
  console.log('Joined room:', msg.roomId);
  socket.emit('roomJoined', msg.roomId);
  console.log('Sockets in this room:', io.nsps['/'].adapter.rooms[msg.roomId].sockets);

  // Initialize the room's data.
  let rm = io.nsps['/'].adapter.rooms[msg.roomId];
  rm.level = 1;
  rm.roundNum = 0;
  rm.prompt = '';
  rm.prompts = [];
  rm.dictionary = {};
  rm.host = '';                      // IMPLEMENT LATER
}

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    console.log(socket.id, 'has connected!');
    addToOpenConnections(socket);

    socket.on('message', msg => {
      messageHandler(msg, io, socket);
    });

    // incoming data should include the "user" who is requesting to create this room
    socket.on('joinRoom', (msg) => {
      joinRoomHandler(msg, io, socket);
    });

    socket.on('disconnect', () => {
      delete openConnections[socket.id];
      console.log(socket.id, 'has disconnected!');
    });
  });
};
