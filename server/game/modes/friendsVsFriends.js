const ignoredCodePoints = require('../helpers/ignoredCodePoints.js');

module.exports = {
  play: function (io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket) {
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];

    let botResponse = {user: 'ebot'};
    if (rm.gameStarted && msg.text.codePointAt(0) > 0x03FF) {
      if (checkAnswer(msg.text, rm.prompt, rm.solutions)) {          // A user replied with a correct answer.
        openConnections[socket.id].score++;                           // Increment the user's score.
        if (rm.roundNum < TESTING_NUM_ROUNDS) {
          nextRound(botResponse, msg, io, rm, openConnections, socket);
        } else if (rm.roundNum === TESTING_NUM_ROUNDS) {              // Current game's selected round num has been reached.
          endGame(botResponse, msg, io, rm, openConnections);
        }
      } else {                                       // A user replied with an incorrect answer.
        wrongAnswer(msg, io, rm);
      }
    } else {
      // Emit user's message to all sockets connected to this room.
      msg.type = 'chat';
      msg.roundNum = rm.roundNum;
      io.sockets.in(msg.roomId).emit('message', msg);
    }
  },

  createRoom: function (msg, io, socket, TESTING_DIFFICULTY) {
    socket.join(msg.roomId);
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];
    Object.assign(rm, {
      gameStarted: false,
      level: TESTING_DIFFICULTY,
      roundNum: 0,
      prompt: '',
      prompts: [],
      solutions: {},
      hints: {},
      type: msg.type,               // options: 'SINGLE_PLAYER', 'FRIENDS_VS_FRIENDS', 'RANKED'
      host: ''                      // IMPLEMENT LATER
    });
    socket.emit('message', {
      user: 'ebot',
      text: `🎉 Welcome to Emoji Face Off! 🎉\xa0\xa0
            \xa0👩 \xa0 Mode: Friends vs Friends \xa0👨

            You are the Host and may start
            the game at any time.`
    });
    socket.emit('message', {
      user: 'ebot',
      text: `Wait for other friends to join room.
            💩 - talk each other while you wait!`
    });
    io.sockets.in(msg.roomId).emit('playerJoinedRoom', {
      playerName: msg.user,
      playerAvatar: msg.avatar,
      room: msg.roomId // Deprecated: Testing only.
    });
  },

  joinRoom: function (msg, io, socket) {
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];
    if (rm === undefined) {       // This room does not exist.
      socket.emit('roomDoesNotExist');
      return;
    } else if (rm !== undefined && rm.type !== 'FRIENDS_VS_FRIENDS') { // Someone trying to enter a non-FRIENDS_VS_FRIENDS room.
      socket.emit('roomDoesNotExist');   // Technically the room exists, but it doesn't matter to the user.
      return;
    }

    // Room exists and it's a FRIENDS_VS_FRIENDS room.
    socket.join(msg.roomId);
    socket.broadcast.to(msg.roomId).emit('message', {
      user: 'ebot',
      text: `${msg.user} has joined the room!`
    });
    io.sockets.in(msg.roomId).emit('playerJoinedRoom', {
      playerName: msg.user,
      playerAvatar: msg.avatar,
      room: msg.roomId // Deprecated: Testing only.
    });

    if (!rm.gameStarted) {
      socket.emit('message', {
        user: 'ebot',
        text: `🎉 Welcome to Emoji Face Off! 🎉\xa0\xa0
              \xa0👩 \xa0 Mode: Friends vs Friends \xa0👨`
      });
      socket.emit('message', {
        user: 'ebot',
        text: `Wait for other friends to join the room.
               💩 - talk each other while you wait!`
      });
    } else if (rm.gameStarted) {
      socket.emit('gameStarted');
      socket.emit('newRound', rm.hints[rm.prompt].length);
      socket.emit('message', {
        user: 'ebot',
        text: `Hello, you've joined a game
               that's already in progress!
               BETTER CATCH UP! 😱

               Round ${rm.roundNum}: Emojify [${rm.prompt}] !`,
        roundNum: rm.roundNum
      });
    }
  },

  startGame: function (msg, io, TESTING_NUM_ROUNDS, RedisController) {
    let botResponse = {user: 'ebot'};
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];
    rm.gameStarted = true;
    RedisController.getPrompts() // ADD BACK rm.level LATER
      .then(filteredPrompts => {
        // randomly populate the room's "prompts" object (based on room's difficulty) from our library.
        while (rm.prompts.length < TESTING_NUM_ROUNDS) {
          let promptIndex = Math.floor(Math.random() * filteredPrompts.length);
          if (!rm.prompts.includes(filteredPrompts[promptIndex])) {
            rm.prompts.push(filteredPrompts[promptIndex]);
          }
        }
        // Create a dictionary of prompt to answers. Answers are in an object for O(1) lookup.
        RedisController.getAllAnswers(rm.prompts)
          .then(solutions => {
            rm.solutions = solutions;
            console.log('SOLUTIONS:', solutions);
            for (let prompt in solutions) {
              rm.hints[prompt] = [...Object.keys(solutions[prompt])[0]];
            }

            console.log(rm.hints);
            rm.prompt = rm.prompts.pop();
            botResponse.text = `${msg.user} has started the game.

                                Round 1: Emojify [${rm.prompt}] !`;
            rm.roundNum = 1;
            botResponse.roundNum = rm.roundNum;

            io.sockets.in(msg.roomId).emit('gameStarted');
            io.sockets.in(msg.roomId).emit('newRound', rm.hints[rm.prompt].length);
            io.sockets.in(msg.roomId).emit('message', botResponse);

            let roundNum = 1;
            setTimeout(() => {
              console.log('time out called:', roundNum, rm.roundNum);
              if (roundNum === rm.roundNum) {
                console.log('TIMED OUT!!!!!!!!!!!!');
              }
            }, 7000);
          });
      });
  }
};

function checkAnswer (guess, prompt, solutions) {
  let msgCodePoints = [...guess];
  let msgWithoutToneModifiers = '';
  for (let codePoint of msgCodePoints) {
    if (!ignoredCodePoints[codePoint]) {     // check to see if it's an ignoredCodePoint
      msgWithoutToneModifiers += codePoint;
    }
  }
  return solutions[prompt][msgWithoutToneModifiers];
}

function nextRound (botResponse, msg, io, rm, openConnections, socket) {
  msg.type = 'correctGuess';
  io.sockets.in(msg.roomId).emit('message', msg);
  rm.prompt = rm.prompts.pop();
  rm.roundNum++;
  botResponse.text = `Round ${rm.roundNum}: Emojify [${rm.prompt}] !`;
  botResponse.roundNum = rm.roundNum;
  io.sockets.in(msg.roomId).emit('newRound', rm.hints[rm.prompt].length);
  socket.emit('score', openConnections[socket.id].score);
  io.sockets.in(msg.roomId).emit('message', botResponse);
}

function findWinner (clientsArray, openConnections) {
  // Grab the winning socketID
  let socketID = clientsArray.reduce((winner, currUser) => {
    console.log(openConnections[currUser].score);
    console.log(openConnections[winner].score);
    if (openConnections[currUser].score > openConnections[winner].score) {
      return currUser;
    } else {
      return winner;
    }
  });

  return openConnections[socketID];
}

function calcFinalRankings (clientsArray, openConnections) {
  let finalRankings = [];
  clientsArray.forEach(client => {
    finalRankings.push(`${openConnections[client].name}: ${openConnections[client].score}`);
  });
  return finalRankings.join('\n');
}

function endGame (botResponse, msg, io, rm, openConnections) {
  let clients = io.nsps['/'].adapter.rooms[msg.roomId].sockets;
  let clientsArray = Object.keys(clients);
  console.log('CLIENTS:', clientsArray);

  let winner = findWinner(clientsArray, openConnections);
  let finalRankings = calcFinalRankings(clientsArray, openConnections);

  msg.type = 'correctGuess';
  io.sockets.in(msg.roomId).emit('message', msg);
  // // First, notify everyone the final answer was correct.
  // botResponse.text = `Good job, ${msg.user}!`;
  // io.sockets.in(msg.roomId).emit('message', botResponse);

  // Reset all users'' scores
  io.sockets.in(msg.roomId).emit('score', 0);
  // Emit winner/final scores.
  botResponse.text = `🏁 🏁 🏁 \xa0Game Completed 🏁 🏁 🏁
                      Congrats to the winner ${winner.name}!

                      Final Scores:
                      ${finalRankings}
                      
                      Press START to begin a new game. 🙌`;
  io.sockets.in(msg.roomId).emit('newRound', 0);
  io.sockets.in(msg.roomId).emit('message', botResponse);
  io.sockets.in(msg.roomId).emit('gameEnded');

  // Reset the room's data.
  rm.roundNum = 0;
  rm.prompt = '';
  rm.prompts = [];
  rm.hints = {};
  rm.solutions = {};
  rm.gameStarted = false;

  // Reset all user's scores to 0.
  for (let id of clientsArray) {
    openConnections[id].score = 0;
  }
}

function wrongAnswer (msg, io, rm) {
  msg.type = 'incorrectGuess';
  io.sockets.in(msg.roomId).emit('message', msg);
}
