const RedisController = require('../db/Redis/RedisController.js');
const RankedQueue = require('../game/helpers/rankedQueue.js');
const singlePlayer = require('../game/modes/singleplayer.js');
const friendsVsFriends = require('../game/modes/friendsVsFriends.js');
const ranked = require('../game/modes/ranked.js');

let openConnections = {};

const TESTING_NUM_ROUNDS = 3;   // CHANGE THIS FOR DIFFERENT NUMBER OF ROUNDS
const TESTING_DIFFICULTY = 1;   // CHANGE THIS FOR DIFFERENT DIFFICULTY OF PROMPTS
function messageHandler (msg, io, socket) {
  if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'SINGLE_PLAYER') {
    singlePlayer.play(io, msg, RedisController, openConnections, socket);
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'FRIENDS_VS_FRIENDS') {
    friendsVsFriends.play(io, msg, RedisController, openConnections, socket);
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'RANKED') {
    ranked.play(io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket);
  }
}

function joinOrCreateRoomHandler (msg, io, socket) {
  // Initialize/store user's info in openConnections
  openConnections[socket.id] = {
    name: msg.user,
    fbId: msg.fbId,
    elo: msg.elo,
    score: 0
  };

  if (msg.type === 'SINGLE_PLAYER') {
    singlePlayer.createRoom(msg, io, socket, TESTING_DIFFICULTY);
  } else if (msg.type === 'FRIENDS_VS_FRIENDS') {
    if (msg.isHost) {
      friendsVsFriends.createRoom(msg, io, socket, TESTING_DIFFICULTY);
    } else {
      friendsVsFriends.joinRoom(msg, io, socket, TESTING_DIFFICULTY);
    }
  } else if (msg.type === 'RANKED') {
    if (io.nsps['/'].adapter.rooms[msg.roomId] === undefined) {
      ranked.createRoom(msg, io, socket, TESTING_DIFFICULTY);
    } else {
      ranked.joinRoom(msg, io, socket, openConnections, TESTING_NUM_ROUNDS, RedisController);
    }
  }
}

function hintHandler (msg, io, socket) {
  let rm = io.nsps['/'].adapter.rooms[msg.roomId];
  socket.emit('hint', rm.hints[rm.prompt][msg.index]);
}

function startGameHandler (msg, io, socket) {
  if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'SINGLE_PLAYER') {
    singlePlayer.startGame(msg, io, socket, RedisController);
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'FRIENDS_VS_FRIENDS') {
    friendsVsFriends.startGame(msg, io, RedisController);
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'RANKED') {
   // Ranked start game logic is handled in ranked.joinRoom()
  }
}

function disconnectHandler (msg, io, socket) {
  if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'SINGLE_PLAYER') {
    // Do nothing.
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'FRIENDS_VS_FRIENDS') {
    friendsVsFriends.leaveRoom(msg, io, socket, openConnections);
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'RANKED') {
    ranked.leaveRoom(msg, io, socket, openConnections);
    // If someone leaves a ranked room, remove the room from ranked queue.
    let rooms = Object.keys(socket.rooms);
    for (let roomId in rooms) {
      if (roomId !== socket.id) {
        RankedQueue.removeRoom(roomId);
      }
    }
  }

  delete openConnections[socket.id];
}

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', socket => {
    openConnections[socket.id] = {};
    console.log(socket.id, 'has connected!');
    console.log('Current open socket connections:', openConnections);

    socket.on('message', msg => {
      messageHandler(msg, io, socket);
    });

    socket.on('hint', msg => {
      hintHandler(msg, io, socket);
    });

    /* incoming msg format:
      {
        user (string): displayname of who is requesting to join this room,
        fbId (string): user's facebook id,
        elo (number): user's ELO,
        roomId (string): which room user is requesting to join,
        type (string): type of room ('SINGLE_PLAYER', 'FRIENDS_VS_FRIENDS', 'RANKED')
      } */
    socket.on('joinOrCreateRoom', msg => {
      joinOrCreateRoomHandler(msg, io, socket);
    });

    socket.on('startGame', msg => {
      startGameHandler(msg, io, socket);
    });

    socket.on('leaveRoom', msg => {
      disconnectHandler(msg, io, socket);
    });

    socket.on('disconnect', () => {
      console.log(socket.id, 'has disconnected!');
    });
  });
};
