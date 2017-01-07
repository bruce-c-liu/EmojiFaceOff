const RedisController = require('../db/Redis/RedisController.js');
const RankedQueue = require('../game/helpers/rankedQueue.js');
const singlePlayer = require('../game/modes/singleplayer.js');
const friendsVsFriends = require('../game/modes/friendsVsFriends.js');
const ranked = require('../game/modes/ranked.js');

let openConnections = {};

function addToOpenConnections (socket) {
  openConnections[socket.id] = {
    socket: socket,
    score: 0,
    name: null
  };
}

const TESTING_NUM_ROUNDS = 1;   // CHANGE THIS FOR DIFFERENT NUMBER OF ROUNDS
const TESTING_DIFFICULTY = 1;   // CHANGE THIS FOR DIFFERENT DIFFICULTY OF PROMPTS
function messageHandler (msg, io, socket) {
  if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'SINGLE_PLAYER') {
    singlePlayer.play(io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket);
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'FRIENDS_VS_FRIENDS') {
    friendsVsFriends.play(io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket);
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'RANKED') {
    ranked.play(io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket);
  }
}

function joinRoomHandler (msg, io, socket) {
  // Initialize/store user's info in openConnections
  openConnections[socket.id].name = msg.user;   // Set the user's name
  openConnections[socket.id].fbId = msg.fbId;   // Set the user's fbID
  openConnections[socket.id].elo = msg.elo;     // Set the user's elo

  if (msg.type === 'SINGLE_PLAYER') {
    singlePlayer.joinRoomHandler(msg, io, socket);
  } else if (msg.type === 'FRIENDS_VS_FRIENDS') {
    friendsVsFriends.joinRoomHandler(msg, io, socket);
  } else if (msg.type === 'RANKED') {
    ranked.joinRoomHandler(msg, io, socket, openConnections, TESTING_NUM_ROUNDS, RedisController);
  }

  // Initialize the room's data.
  let rm = io.nsps['/'].adapter.rooms[msg.roomId];
  rm.level = TESTING_DIFFICULTY;
  rm.roundNum = 0;
  rm.prompt = '';
  rm.prompts = [];
  rm.solutions = {};
  rm.hints = {};
  rm.type = msg.type;                // options: 'SINGLE_PLAYER', 'FRIENDS_VS_FRIENDS', 'RANKED'
  rm.host = '';                      // IMPLEMENT LATER
}

function hintHandler (msg, io, socket) {
  let rm = io.nsps['/'].adapter.rooms[msg.roomId];
  socket.emit('hint', rm.hints[rm.prompt][msg.index]);
}

function startGameHandler (msg, io, socket) {
  if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'SINGLE_PLAYER') {
    singlePlayer.startGame(msg, io, socket, TESTING_NUM_ROUNDS, RedisController);
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'FRIENDS_VS_FRIENDS') {
    friendsVsFriends.startGame(msg, io, TESTING_NUM_ROUNDS, RedisController);
  } else if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'RANKED') {
   // ranked.startGame(io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket);
  }
}

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', socket => {
    console.log(socket.id, 'has connected!');
    addToOpenConnections(socket);

    socket.on('message', msg => {
      messageHandler(msg, io, socket);
      console.log(socket.rooms);
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
      joinRoomHandler(msg, io, socket);
    });

    socket.on('startGame', msg => {
      startGameHandler(msg, io, socket);
    });

    socket.on('disconnect', () => {
      let rooms = Object.keys(socket.rooms);
      for (let roomId in rooms) {
        if (roomId !== socket.id) {
          RankedQueue.removeRoom(roomId);
        }
      }
      delete openConnections[socket.id];
      console.log(socket.id, 'has disconnected!');
    });
  });
};
