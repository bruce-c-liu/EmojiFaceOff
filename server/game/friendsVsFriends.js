const skinTones = require('./skinTones.js');

module.exports = function (io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket) {
    // Populate all info from this socket room.
  let rm = io.nsps['/'].adapter.rooms[msg.roomId];

  // Emit user's message to all sockets connected to this room.
  io.sockets.in(msg.roomId).emit('message', msg);

  let botResponse = {user: 'ebot'};

  if (rm.roundNum === 0) {
    if (msg.text === 'start') {
      startGame(botResponse, msg, io, rm, TESTING_NUM_ROUNDS, RedisController);
    } else {
      botResponse.text = `Send 'start' to begin the game, dumbass.`;
      io.sockets.in(msg.roomId).emit('message', botResponse);
    }
  } else if (rm.roundNum <= TESTING_NUM_ROUNDS) {
    if (checkAnswer(msg.text, rm.prompt, rm.dictionary)) {          // A user replied with a correct answer.
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
};

function checkAnswer (guess, prompt, dictionary) {
  let msgCodePoints = [...guess];
  let msgWithoutToneModifiers = '';
  for (let codePoint of msgCodePoints) {
    if (!skinTones[codePoint]) {     // check to see if it's a skin tone modifier
      msgWithoutToneModifiers += codePoint;
    }
  }
  return dictionary[prompt][msgWithoutToneModifiers];
}

function startGame (botResponse, msg, io, rm, TESTING_NUM_ROUNDS, RedisController) {
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
      for (let prompt of rm.prompts) {
        RedisController.getAnswers(prompt)
          .then(answers => {
            rm.dictionary[prompt] = {};
            for (let answer of answers) {
              rm.dictionary[prompt][answer] = true;
            }
          });
      }

      rm.prompt = rm.prompts.pop();
      botResponse.text = `Welcome to Emoji Face Off!
                          Round 1
                          Please translate [${rm.prompt}] into emoji form~`;
      rm.roundNum = 1;
      botResponse.roundNum = rm.roundNum;
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
}

function nextRound (botResponse, msg, io, rm, openConnections, socket) {
  rm.prompt = rm.prompts.pop();
  rm.roundNum++;
  botResponse.text = `Good job, ${msg.user}! 
                      Round ${rm.roundNum}
                      Please translate [${rm.prompt}] into emoji form~`;
  botResponse.roundNum = rm.roundNum;
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
  io.sockets.in(msg.roomId).emit('message', botResponse);

  // Reset the room's data.
  rm.roundNum = 0;
  rm.prompt = '';
  rm.prompts = [];
  rm.dictionary = {};

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
