const RedisController = require('../db/Redis/RedisController.js');
let openConnections = {};

function addToOpenConnections (socket) {
  openConnections[socket.id] = {
    socket: socket,
    score: 0,
    name: null
  };
}

function messageHandler (data, io, socket) {
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
                              Please translate [${prompt}] into emoji form~`;
                      
          botResponse.roundNum = 1;
          io.sockets.in(roomId).emit('score', 0);
          io.sockets.in(roomId).emit('message', botResponse);
          room.roundNum = 1;
          roundNum = 1;
          room.prompt = prompt;
          room.selectedIndices.push(promptIndex);
          setTimeout(() => {
            console.log('time out called', roundNum, room.roundNum);
            if (roundNum === room.roundNum) {
              console.log('TIMED OUT!!!!!!!!!!!!');
            }
          }, 7000);
        });
    } else {
      botResponse.text = `Send 'start' to begin the game, dumbass.`;
      io.sockets.in(roomId).emit('message', botResponse);
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
                                        Please translate [${prompt}] into emoji form~`;
                botResponse.ansLength = 4;      
                botResponse.roundNum = roundNum + 1;
                socket.emit('score', user.score);
                io.sockets.in(roomId).emit('message', botResponse);
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

            winner = openConnections[winner];

            botResponse.text = `Good job, ${data.user}!
                                    The winner is ${winner.name} with ${winner.score} points!
                                    Send 'start' to begin a new game.`;
            io.sockets.in(roomId).emit('score', null);
            io.sockets.in(roomId).emit('message', botResponse);
            room.roundNum = 0;
            room.prompt = '';
            room.selectedIndices = [];
            user.score = 0;
          }
        } else if (!correct) {                                       // A user replied with an incorrect answer.
          botResponse.text = `That is not the correct answer, ${data.user}!`;
          botResponse.roundNum = roundNum;
          io.sockets.in(roomId).emit('message', botResponse);
        }
      });
  }
}

function joinRoomHandler (data, io, socket) {
  let roomId = data.roomId;
  let user = openConnections[socket.id];
  user.name = data.user;
  socket.join(roomId);
  console.log('Joined room:', roomId);
  socket.emit('roomJoined', roomId);
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
    console.log('connected!');
    addToOpenConnections(socket);

    socket.on('message', data => {
      messageHandler(data, io, socket);
    });

    // incoming data should include the "user" who is requesting to create this room
    socket.on('joinRoom', (data) => {
      joinRoomHandler(data, io, socket);
    });

    socket.on('disconnect', () => {
      delete openConnections[socket.id];
      console.log('disconnected!');
    });
  });
};
