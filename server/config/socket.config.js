const shortid = require('shortid');
const RedisController = require('../db/Redis/RedisController.js');
let openConnections = {};

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    openConnections[socket.id] = {
      socket: socket,
      score: 0,
      name: ''
    };
    let user = openConnections[socket.id];

    socket.on('message', data => {
      user.name = data.name;
      let userMessage = data.text;
      let botResponse = '';
      let roomId = data.roomId;                   // client
      let level = data.level;                     // client
      let promptIndex;
      let roundNum = data.roundNum;               // client
      let prompt = data.prompt;                   // client
      let selectedIndices = data.selectedIndices; // client: Prompts that have already been shown

      if (roundNum === 0) {
        if (userMessage === 'start') {
          RedisController.getPrompts(level)
            .then(filteredPrompts => {
              do {                              // Find a new selectable prompt at random.
                promptIndex = Math.floor(Math.random() * filteredPrompts.length);
              } while (selectedIndices.includes(promptIndex));
              prompt = filteredPrompts[promptIndex];
              botResponse = {
                'user': 'ebot',
                'text': `Welcome to Emoji Face Off! 
                    Round 1
                    Please translate '${prompt}' into emoji form~`
              };
              io.sockets.in(roomId).emit('message', botResponse);
              io.sockets.in(roomId).emit('update', {
                roundNum: 1,
                prompt: prompt,
                selectedIndices: selectedIndices.push(promptIndex)
              });
            });
        } else {
          botResponse = {
            'user': 'ebot',
            'text': `Send 'start' to begin the game, dumbass.`
          };
          io.sockets.in(roomId).emit('message', botResponse);
        }
      } else if (roundNum <= 5) {
        RedisController.checkAnswer(prompt, userMessage)
          .then(correct => {
            if (correct) {        // A user replied with a correct answer.
              user.score++;       // Increment the user's score.
              if (roundNum < 5) {
                RedisController.getPrompts(level)
                  .then(filteredPrompts => {
                    do {                                         // Find a new selectable prompt at random.
                      promptIndex = Math.floor(Math.random() * filteredPrompts.length);
                    } while (selectedIndices.includes(promptIndex));
                    prompt = filteredPrompts[promptIndex];
                    botResponse = {
                      'user': 'ebot',
                      'text': `Good job, ${data.user}! 
                      Round ${roundNum + 1}
                      Please translate '${prompt}' into emoji form~`
                    };
                    io.sockets.in(roomId).emit('message', botResponse);
                    io.sockets.in(roomId).emit('update', {
                      selectedIndices: selectedIndices.push(promptIndex),
                      roundNum: roundNum + 1,
                      prompt: prompt
                    });
                    socket.emit('correct');
                  });
              } else if (roundNum === 5) {                   // Current game has ended.
                let clients = io.nsps['/'].adapter.rooms[roomId].sockets;
                let winner = clients.reduce((winner, currUser) => {
                  if (openConnections[currUser].score > openConnections[winner].score) {
                    return currUser;
                  }
                })[0];

                botResponse = {
                  'user': 'ebot',
                  'text': `Good job, ${data.user}!
                   The winner is ${winner.name} with ${winner.score} points!
                   Send 'start' to begin a new game.`
                };
                io.sockets.in(roomId).emit('message', botResponse);
                io.sockets.in(roomId).emit('update', {
                  selectedIndices: [],
                  roundNum: 0,
                  prompt: ''
                });
              }
            } else if (!correct) {                                       // A user replied with an incorrect answer.
              botResponse = {
                'user': 'ebot',
                'text': `That is not the correct answer, ${data.user}!`
              };
              io.sockets.in(roomId).emit('message', botResponse);
            }
          });
      }
    });

    // incoming data should include the "user" who is requesting to create this room
    socket.on('newSinglePlayerRoom', (data) => {
      let roomId = shortid.generate();
      socket.join(roomId);
      // Add the new room to DB and (redis?)
      io.sockets.in(roomId).emit('roomCreated', {     // only emit to sockets in that room
        roomId: roomId
      });
      let room = io.nsps['/'].adapter.rooms[roomId];
      room.level = 1;
      room.round = 0;
      room.prompt = '';
      room.host = '';
      // console.log(room);
      // console.log(socket.nsp.adapter.rooms);
      // console.log('LOOK!', openConnections);
    });
  });
};
