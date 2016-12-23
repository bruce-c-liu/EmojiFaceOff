const RedisController = require('../db/Redis/RedisController.js');
let openConnections = {};

function addToOpenConnections (socket) {
  openConnections[socket.id] = {
    socket: socket,
    score: 0,
    name: null
  };
}

function messageHandler (data, io) {
  // Populate all info from this socket room.
  let roomId = data.roomId;
  let room = io.nsps['/'].adapter.rooms[roomId];
  let roundNum = room.roundNum;
  let prompt = room.prompt;                   // Room's current prompt.
  let selectedIndices = room.selectedIndices; // Prompt indices that have already been selected.
  let level = room.level;                     // Room's current difficulty level.

  // Emit user's message to all sockets connected to this room.
  io.sockets.in(roomId).emit('message', data);

  // User data.
  let user = openConnections[socket.id];
  let userMessage = data.text;
  user.name = user.name === null ? data.user : user.name;

  let botResponse = { 'user': 'ebot' };

  if (roundNum === 0) {
    if (userMessage === 'start') {
      RedisController.getPrompts(level)
        .then(filteredPrompts => {
          console.log(filteredPrompts);
          let promptIndex;
          do {                              // Find a new selectable prompt at random.
            promptIndex = Math.floor(Math.random() * filteredPrompts.length);
          } while (selectedIndices.includes(promptIndex));
          prompt = filteredPrompts[promptIndex];
          botResponse.text = `Welcome to Emoji Face Off! 
                                  Round 1
                                  Please translate '${prompt}' into emoji form~`;
          room.roundNum = 1;
          room.prompt = prompt;
          room.selectedIndices.push(promptIndex);
        });
    } else {
      console.log(roomId);
      botResponse.text = `Send 'start' to begin the game, dumbass.`;
    }
  } else if (roundNum <= 3) {
    RedisController.checkAnswer(prompt, userMessage)
      .then(correct => {
        if (correct) {        // A user replied with a correct answer.
          user.score++;       // Increment the user's score.
          if (roundNum < 3) {
            RedisController.getPrompts(level)
              .then(filteredPrompts => {
                let promptIndex;
                do {                                         // Find a new selectable prompt at random.
                  promptIndex = Math.floor(Math.random() * filteredPrompts.length);
                } while (selectedIndices.includes(promptIndex));
                prompt = filteredPrompts[promptIndex];
                botResponse.text = `Good job, ${data.user}! 
                                        Round ${roundNum + 1}
                                        Please translate '${prompt}' into emoji form~`;
                room.roundNum++;
                room.prompt = prompt;
                room.selectedIndices.push(promptIndex);
              });
          } else if (roundNum === 3) {                   // Current game has ended.
            let clients = io.nsps['/'].adapter.rooms[roomId].sockets;
            let clientsArray = Object.keys(clients);
            console.log('CLIENTS:', clientsArray);

            let winner = clientsArray.reduce((winner, currUser) => {
              console.log(openConnections[currUser].score);
              console.log(openConnections[winner].score);
              if (openConnections[currUser].score > openConnections[winner].score) {
                return currUser;
              } else {
                return winner;
              }
            });

            console.log(winner);
            winner = openConnections[winner];

            botResponse.text = `Good job, ${data.user}!
                                    The winner is ${winner.name} with ${winner.score} points!
                                    Send 'start' to begin a new game.`;
            room.roundNum = 0;
            room.prompt = '';
            room.selectedIndices = [];
          }
        } else if (!correct) {                                       // A user replied with an incorrect answer.
          botResponse.text = `That is not the correct answer, ${data.user}!`;
        }
      });
  }
  io.sockets.in(roomId).emit('message', botResponse);
}

function joinRoomHandler (data, io, socket) {
  let roomId = data.roomId;
  socket.join(roomId);
  socket.emit('roomJoined', {
    roomId: roomId
  });
  let room = io.nsps['/'].adapter.rooms[roomId];
  room.level = 1;
  room.roundNum = 0;
  room.prompt = '';
  room.host = '';                      // IMPLEMENT LATER
  room.selectedIndices = [];
}

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    addToOpenConnections(socket);

    socket.on('message', data => {
      messageHandler(data, io);
    });

    // incoming data should include the "user" who is requesting to create this room
    socket.on('joinRoom', (data) => {
      joinRoomHandler(data, io, socket);
    });

    socket.on('disconnect', () => {
      delete openConnections[socket.id];
    });
  });
};
