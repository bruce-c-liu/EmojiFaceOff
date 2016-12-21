const shortid = require('shortid');
const RedisController = require('../db/Redis/RedisController.js');
let openConnections = {};

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    openConnections[socket.id] = {socket: socket};
    let connection = openConnections[socket.id];
    RedisController.getPrompts(1).then(prompts => console.log(prompts));
    socket.emit('user connected');

    let roundNum;                  // via redis: current round of this room
    let promptIndex;               // calculated here when necessary
    let prompt;                    // via redis: current prompt that is being worked on
    let botResponse;               // created on message
    let userMessage;               // alias for incoming user's text
    let usersInRoom;               // via redis: retrieve all users in this room.
    let level;                     // via redis: difficulty of this room right now

    socket.on('message', data => {
      let userMessage = data.text;
      let level = data.level;
      let roundNum = data.roundNum;
      let prompt = data.prompt;
      RedisController.getPrompts(level)
        .then(prompts => {
          let libraryFilteredByLevel = prompts;
        });

      if (roundNum === 0) {
        if (userMessage === 'start') {
          RedisController.getPrompts(level)
        .then(prompts => {
          let libraryFilteredByLevel = prompts;
        });
          do {                              // Find a new selectable prompt at random.
            promptIndex = Math.floor(Math.random() * libraryFilteredByLevel.length);
          } while (libraryFilteredByLevel[promptIndex].selectable === false);
          prompt = libraryFilteredByLevel[promptIndex];
          botResponse = {
            'user': 'ebot',
            'text': `Welcome to Emoji Face Off! 
                 Round ${roundNum}
                 Please translate '${prompt.prompt}' into emoji form~`
          };
          socket.emit('message', botResponse);
        } else {
          botResponse = {
            'user': 'ebot',
            'text': `Send 'start' to begin the game, dumbass.`
          };
          socket.emit('message', botResponse);
        }
      } else if (roundNum <= 5) {
        if (prompt.answers.includes(userMessage)) {        // A user replied with a correct answer.
          prompt.selectable = false;                       // Make the prompt not selectable anymore.
          for (let user of usersInRoom) {                  // Increment the user's score.
            if (user.name === data.user) {
              user.score++;
            }
          }

          if (roundNum < 5) {
            roundNum++;                                  // Increment round number.
            do {                                         // Find a new selectable prompt at random.
              promptIndex = Math.floor(Math.random() * libraryFilteredByLevel.length);
            } while (libraryFilteredByLevel[promptIndex].selectable === false);
            prompt = libraryFilteredByLevel[promptIndex];
            botResponse = {
              'user': 'ebot',
              'text': `Good job, ${data.user}! 
                   Round ${roundNum}
                   Please translate '${prompt.prompt}' into emoji form~`
            };
            socket.emit('message', botResponse);
          } else if (roundNum === 5) {                   // Current game has ended.
            roundNum = 0;                                // Reset round number.
            let winner = usersInRoom.reduce((prevUser, currUser) => {
              if (currUser.score > prevUser.score) {
                return currUser;
              }
            })[0];
            botResponse = {
              'user': 'ebot',
              'text': `Good job, ${data.user}!
                   The winner is ${winner.name} with ${winner.score} points!
                   Send 'start' to begin a new game.`
            };
            usersInRoom.forEach(user => {              // Reset user scores.
              user.score = 0;
            });
          }
        } else {                                       // A user replied with an incorrect answer.
          botResponse = {
            'user': 'ebot',
            'text': `That is not the correct answer, ${data.user}!`
          };
          socket.emit('message', botResponse);
        }
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
      connection.roomId = roomId;
      // console.log(room);
      // console.log(socket.nsp.adapter.rooms);
      // console.log('LOOK!', openConnections);
    });
  });
};
