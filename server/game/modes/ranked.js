const ignoredCodePoints = require('../helpers/ignoredCodePoints.js');
const elo = require('../helpers/elo.js');

module.exports = {
  play: function (io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket) {
    // Populate all info from this socket room.
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];

    // Emit user's message to all sockets connected to this room.
    io.sockets.in(msg.roomId).emit('message', msg);

    let botResponse = {user: 'ebot'};

    if (rm.roundNum === 0) {
      botResponse.text = `Please wait for opponent to join room.`;
      socket.emit('message', botResponse);
    } else {
      if (checkAnswer(msg.text, rm.prompt, rm.solutions)) {          // A user replied with a correct answer.
        openConnections[socket.id].score++;                           // Increment the user's score.
        if (rm.roundNum < TESTING_NUM_ROUNDS) {
          nextRound(botResponse, msg, io, rm, openConnections, socket);
        } else if (rm.roundNum === TESTING_NUM_ROUNDS) {              // Current game's selected round num has been reached.
          endGame(botResponse, msg, io, rm, openConnections);
        }
      } else {                                       // A user replied with an incorrect answer.
        wrongAnswer(botResponse, msg, io, rm);
      }
    }
  },

  joinRoomHandler: function (msg, io, socket, TESTING_NUM_ROUNDS, RedisController) {
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];
    let numPlayers;
    // var clientsArray = Object.keys(rm.sockets);
    if (rm === undefined) {
      numPlayers = 0;
    } else {
      numPlayers = Object.keys(rm.sockets).length;
    }

    if (numPlayers === 2) {
      // TO-DO: DENY ENTRY
      socket.emit('message', {
        user: 'ebot',
        text: `There are already 2 players in this RANKED room.
               You have not been added to this room.`
      });
      return;
    } else if (numPlayers < 2) {
      // Add this socket to the room.
      socket.join(msg.roomId);
      console.log('Joined room:', msg.roomId);
      socket.emit('roomJoined', msg.roomId);
      console.log('Sockets in this room:', io.nsps['/'].adapter.rooms[msg.roomId].sockets);
      socket.broadcast.to(msg.roomId).emit('message', {
        user: 'ebot',
        text: `${msg.user} has joined the room!`
      });
      numPlayers++;
      if (numPlayers === 2) {
        startGame(msg, io, rm, TESTING_NUM_ROUNDS, RedisController);
      }
    }
  }
};

function startGame (msg, io, rm, TESTING_NUM_ROUNDS, RedisController) {
  let botResponse = {user: 'ebot'};
  RedisController.getPrompts(rm.level)
    .then(filteredPrompts => {
      // randomly populate the room's "prompts" object from our library.
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
          botResponse.text = `Welcome to Emoji Face Off!
                              You are playing [RANKED MODE].
                              
                              Round 1
                              Please translate [${rm.prompt}] into emoji form~`;
          rm.roundNum = 1;
          botResponse.roundNum = rm.roundNum;
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
  console.log(rm.hints);
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

function findWinner (p1, p2) {
  return p1.score > p2.score ? p1 : p2;
}

function findLoser (p1, p2) {
  return p1.score > p2.score ? p2 : p1;
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

  let p1 = openConnections[clientsArray[0]];
  let p2 = openConnections[clientsArray[1]];
  let winner = findWinner(p1, p2);
  let loser = findLoser(p1, p2);
  let finalRankings = calcFinalRankings(clientsArray, openConnections);
  let expectedScoreP1 = elo.expectedScoreP1(winner.elo, loser.elo);
  let changeInELO = elo.changeInELO(winner.elo, expectedScoreP1, 1);

  elo.updateELOs(winner.fbId, winner.elo + changeInELO, loser.fbId, loser.elo - changeInELO);

  // First, notify everyone the final answer was correct.
  botResponse.text = `Good job, ${msg.user}!`;
  io.sockets.in(msg.roomId).emit('message', botResponse);
  // Reset all users'' scores
  io.sockets.in(msg.roomId).emit('score', null);
  // Emit winner/final scores.
  botResponse.text = `Game Finished.
                      The winner is ${winner.name} with ${winner.score} points!

                      Final Scores:
                      ${finalRankings}
                      Send 'start' to begin a new game.`;
  io.sockets.in(msg.roomId).emit('newRound', 0);
  io.sockets.in(msg.roomId).emit('message', botResponse);

  // Reset the room's data.
  rm.roundNum = 0;
  rm.prompt = '';
  rm.prompts = [];
  rm.hints = {};
  rm.solutions = {};

  // Reset all user's scores to 0.
  for (let id in openConnections) {
    openConnections[id].score = 0;
  }
}

function wrongAnswer (botResponse, msg, io, rm) {
  botResponse.text = `That is not the correct answer, ${msg.user}!`;
  botResponse.roundNum = rm.roundNum;
  io.sockets.in(msg.roomId).emit('message', botResponse);
}
