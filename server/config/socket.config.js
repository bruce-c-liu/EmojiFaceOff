const RankedQueue = require('../game/helpers/rankedQueue.js');
const singlePlayer = require('../game/modes/singleplayer.js');
const friendsVsFriends = require('../game/modes/friendsVsFriends.js');
const ranked = require('../game/modes/ranked.js');

let io, rooms;
let clients = {}; // Currently connected clients.

module.exports = function initSocketIO (server) {
  io = require('socket.io')(server, {'pingInterval': 25000, 'pingTimeout': 360000});
  rooms = io.nsps['/'].adapter.rooms;

  io.on('connection', socket => {
    clients[socket.id] = {};
    console.log(socket.id, 'has connected!');

    socket.on('message', msg => {
      messageHandler(msg, socket);
    });

    socket.on('createRoom', data => {
      createRoomHandler(data, socket);
    });

    socket.on('joinRoom', data => {
      joinRoomHandler(data, socket);
    });

    socket.on('startGame', roomId => {
      startGameHandler(roomId, socket);
    });

    socket.on('hint', msg => {
      hintHandler(msg, socket);
    });

    socket.on('disconnect', () => {
      disconnectHandler(socket);
      console.log(socket.id, 'has disconnected!');
    });
  });
};

function messageHandler (msg, socket) {
  let room = rooms[msg.roomId];
  if (room === undefined) {
    socket.emit('message', {
      user: 'ebot',
      text: `Sorry, you have idled for more than 10 minutes and have been disconnected. 😰
             
             Please enter Mode Select and begin a new game. `
    });
    return;
  }
  switch (room.type) {
    case 'SINGLE_PLAYER': singlePlayer.play(io, socket, clients, room, msg); break;
    case 'FRIENDS_VS_FRIENDS': friendsVsFriends.play(io, socket, clients, room, msg); break;
    case 'RANKED': ranked.play(); break;
    default: console.log('Incoming createRoom event did not have a valid "type" property');
  }
}

function createRoomHandler (data, socket) {
  // Initialize/store user's info in clients
  clients[socket.id] = {
    name: data.user,
    fbId: data.fbId,
    roomId: data.roomId,
    isHost: true,
    elo: data.elo,
    score: 0
  };

  switch (data.type) {
    case 'SINGLE_PLAYER': singlePlayer.createRoom(io, socket, rooms, data); break;
    case 'FRIENDS_VS_FRIENDS': friendsVsFriends.createRoom(io, socket, rooms, data); break;
    default: console.log('Incoming createRoom event did not have a valid "type" property');
  }
}

function joinRoomHandler (data, socket) {
  // Initialize/store user's info in clients
  clients[socket.id] = {
    name: data.user,
    fbId: data.fbId,
    roomId: data.roomId,
    isHost: false,
    elo: data.elo,
    score: 0
  };

  let room = rooms[data.roomId];
  switch (data.type) {
 // No case for 'SINGLE_PLAYER'. Single player rooms can only be created, not joined.
    case 'FRIENDS_VS_FRIENDS': friendsVsFriends.joinRoom(io, socket, room, data); break;
    case 'RANKED':
      if (!rooms[data.roomId]) {
        ranked.createRoom(); break;
      } else {
        ranked.joinRoom(); break;
      }
    default: console.log('Incoming createRoom event did not have a valid "type" property');
  }
}

function startGameHandler (roomId, socket) {
  let room = rooms[roomId];
  if (room === undefined) {
    socket.emit('message', {
      user: 'ebot',
      text: `Sorry, you have idled for more than 10 minutes and have been disconnected. 😰
             
             Please enter Mode Select and begin a new game. `
    });
    return;
  }
  switch (room.type) {
    case 'SINGLE_PLAYER': singlePlayer.startGame(io, socket, room); break;
    case 'FRIENDS_VS_FRIENDS': friendsVsFriends.startGame(io, socket, clients, room, roomId); break;
 // No case for 'RANKED'. Ranked start game logic is handled in ranked.createOrJoinRoom()
    default: console.log('Bad startGameHandler() args.');
  }
}

function hintHandler (msg, socket) {
  let rm = rooms[msg.roomId];
  if (rm === undefined) {
    socket.emit('message', {
      user: 'ebot',
      text: `Sorry, you have idled for more than 10 minutes and have been disconnected. 😰
             
             Please enter Mode Select and begin a new game. `
    });
    return;
  }
  socket.emit('hint', rm.hints[rm.prompt][msg.index]);
}

function disconnectHandler (socket) {
  // Note: If a user is the last to leave a room, the room will not exist when
  // it gets to this handler.
  let room = rooms[clients[socket.id].roomId];
  if (room !== undefined) {
    switch (room.type) {
      case 'SINGLE_PLAYER': break;
      case 'FRIENDS_VS_FRIENDS': friendsVsFriends.leaveRoom(io, socket, clients, room); break;
      case 'RANKED': ranked.leaveRoom(socket, rm); break;
      default: console.log('Something horrible went wrong.');
    }

      // TODO: Remove a user from ranked queue upon disconnection. Move logic into ranked.js
      // let rooms = Object.keys(socket.rooms);
      // for (let roomId in rooms) {
      //   if (roomId !== socket.id) {
      //     RankedQueue.removeRoom(roomId);
      //   }
      // }
  }
  delete clients[socket.id];
}
