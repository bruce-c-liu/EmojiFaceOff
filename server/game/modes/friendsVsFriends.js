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

  joinRoomHandler: function (msg, io, socket) {
    if (io.nsps['/'].adapter.rooms[msg.roomId]) {
      if (io.nsps['/'].adapter.rooms[msg.roomId].type === 'SINGLE_PLAYER') {
        socket.emit('message', {
          user: 'ebot',
          text: 'This is a single player room! Get outta here! 😡'
        });
      }
    } else {
      socket.join(msg.roomId);
      console.log('Joined room:', msg.roomId);

      socket.emit('message', {
        user: 'ebot',
        text: `Welcome to Emoji Face Off! 

              💩 - talk each other while waiting for other friends to join.`
      });
      console.log('Sockets in this room:', io.nsps['/'].adapter.rooms[msg.roomId].sockets);
      socket.broadcast.to(msg.roomId).emit('message', {
        user: 'ebot',
        text: `${msg.user} has joined the room!`
      });
      io.sockets.in(msg.roomId).emit('roomJoined', {
        playerName: `${msg.user}`,
        playerAvatar: `${msg.avatar}`,
        room: msg.roomId
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

                                Welcome to Emoji Face Off! 
                                Are you doge enough?

                                Round 1
                                Please translate [${rm.prompt}] into emoji form~`;
            rm.roundNum = 1;
            botResponse.roundNum = rm.roundNum;

            io.sockets.in(msg.roomId).emit('gameStarted');
            io.sockets.in(msg.roomId).emit('newRound', rm.hints[rm.prompt].length);
            io.sockets.in(msg.roomId).emit('score', 0);
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
  botResponse.text = `Good job, ${msg.user}! 

                      Round ${rm.roundNum}
                      Please translate [${rm.prompt}] into emoji form~`;
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
  let finalRankings = '';
  clientsArray.forEach(client => {
    finalRankings += `${openConnections[client].name}: ${openConnections[client].score}\n`;
  });
  return finalRankings;
}

function endGame (botResponse, msg, io, rm, openConnections) {
  let clients = io.nsps['/'].adapter.rooms[msg.roomId].sockets;
  let clientsArray = Object.keys(clients);
  console.log('CLIENTS:', clientsArray);

  let winner = findWinner(clientsArray, openConnections);
  let finalRankings = calcFinalRankings(clientsArray, openConnections);

  msg.type = 'correctGuess';
  io.sockets.in(msg.roomId).emit('message', msg);
  // First, notify everyone the final answer was correct.
  botResponse.text = `Good job, ${msg.user}!`;
  io.sockets.in(msg.roomId).emit('message', botResponse);
  // Reset all users'' scores
  io.sockets.in(msg.roomId).emit('score', null);
  // Emit winner/final scores.
  botResponse.text = `Game Completed.
                      The winner is ${winner.name} with ${winner.score} points!

                      Final Scores:
                      ${finalRankings}
                      Press 'start' to begin a new game.`;
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
  msg.roundNum = rm.roundNum;
  io.sockets.in(msg.roomId).emit('message', msg);
}
