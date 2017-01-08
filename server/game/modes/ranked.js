const ignoredCodePoints = require('../helpers/ignoredCodePoints.js');
const elo = require('../helpers/elo.js');

module.exports = {
  play: function (io, msg, TESTING_NUM_ROUNDS, RedisController, openConnections, socket) {
    // Populate all info from this socket room.
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];

    let botResponse = {user: 'ebot'};

    if (!rm.gameStarted) {
      botResponse.text = `Please wait while we search for a suitable opponent. 😘`;
      socket.emit('message', botResponse);
    } else if (!rm.gameFinished && msg.text.codePointAt(0) > 0x03FF) {
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
      msg.roundNum = rm.roundNum;
      msg.type = 'chat';
      io.sockets.in(msg.roomId).emit('message', msg);
    }
  },

  createRoom: function (msg, io, socket, TESTING_DIFFICULTY) {
    socket.join(msg.roomId);
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];
    Object.assign(rm, {
      level: TESTING_DIFFICULTY,
      gameStarted: false,
      gameFinished: false,
      roundNum: 0,
      prompt: '',
      prompts: [],
      solutions: {},
      hints: {},
      type: msg.type,               // options: 'SINGLE_PLAYER', 'FRIENDS_VS_FRIENDS', 'RANKED'
      host: ''                      // TODO
    });
    socket.emit('playerJoinedRoom', {
      playerName: `${msg.user}`,
      playerAvatar: `${msg.avatar}`,
      room: msg.roomId
    });
    socket.emit('message', {
      user: 'ebot',
      text: 'Please wait while we search for a suitable opponent. 😘'
    });
  },

  joinRoom: function (msg, io, socket, openConnections, TESTING_NUM_ROUNDS, RedisController) {
    socket.join(msg.roomId);
    socket.emit('playerJoinedRoom', {
      playerName: `${msg.user}`,
      playerAvatar: `${msg.avatar}`,
      room: msg.roomId
    });
    console.log('Sockets in this room:', io.nsps['/'].adapter.rooms[msg.roomId].sockets);

    socket.broadcast.to(msg.roomId).emit('message', {
      user: 'ebot',
      text: `${msg.user} has joined the room!`
    });

    startGame(msg, io, openConnections, TESTING_NUM_ROUNDS, RedisController);
  },

  leaveRoom: function (msg, io, socket, openConnections) {
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];
    if (rm.gameStarted) {
      endGameByLeaving(msg, io, socket, rm, openConnections);
    }
  }
};

function startGame (msg, io, openConnections, TESTING_NUM_ROUNDS, RedisController) {
  let rm = io.nsps['/'].adapter.rooms[msg.roomId];
  rm.gameStarted = true;
  let botResponse = {user: 'ebot'};
  let clients = io.nsps['/'].adapter.rooms[msg.roomId].sockets;
  let clientsArray = Object.keys(clients);
  rm.p1 = openConnections[clientsArray[0]];
  rm.p2 = openConnections[clientsArray[1]];
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
          botResponse.text = `\xa0\xa0🎉 Welcome to Emoji Face Off! 🎉\xa0\xa0
                              \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 🏆\xa0 Mode: Ranked 🏆
                              
                              ${rm.p1.name} (RATING: ${rm.p1.elo})
                              ${rm.p2.name} (RATING: ${rm.p2.elo})
                              
                              Round 1: Emojify [${rm.prompt}] !`;
          rm.roundNum = 1;
          botResponse.roundNum = rm.roundNum;

          io.sockets.in(msg.roomId).emit('newRound', rm.hints[rm.prompt].length);
          io.sockets.in(msg.roomId).emit('message', botResponse);
          io.sockets.in(msg.roomId).emit('gameStarted');

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
  let msgWithoutModifiers = '';
  for (let codePoint of msgCodePoints) {
    if (!ignoredCodePoints[codePoint]) {     // check to see if it's an ignoredCodePoint
      msgWithoutModifiers += codePoint;
    }
  }
  return solutions[prompt][msgWithoutModifiers];
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

function findWinner (p1, p2) {
  return p1.score > p2.score ? p1 : p2;
}

function findLoser (p1, p2) {
  return p1.score > p2.score ? p2 : p1;
}

function endGameByLeaving (msg, io, socket, rm, openConnections) {
  rm.gameFinished = true;
  let clients = io.nsps['/'].adapter.rooms[msg.roomId].sockets;
  let clientsArray = Object.keys(clients); // The two socketIds in this room
  let winner, loser;

  for (let client of clientsArray) {
    if (client === socket.id) {
      loser = openConnections[client];
    } else {
      winner = openConnections[client];
    }
  }
  io.sockets.in(msg.roomId).emit('message', {
    user: 'ebot',
    text: `Your opponent has left the room. 
           You win! 😂`
  });
  // ELO changes
  let expectedScoreP1 = elo.expectedScoreP1(winner.elo, loser.elo);
  let changeInELO = Math.round(elo.changeInELO(winner.elo, expectedScoreP1, 1));

  loser.elo = loser.elo - changeInELO;
  if (loser.elo < 0) {
    loser.elo = 0;
  }
  winner.elo = winner.elo + changeInELO;
  elo.updateELOs(winner.fbId, winner.elo, loser.fbId, loser.elo);

  io.sockets.in(msg.roomId).emit('message', {
    user: 'ebot',
    text: `🏁 🏁 🏁 \xa0Game Completed 🏁 🏁 🏁
                      Congrats to the winner ${winner.name}!

                      Final Scores:
                      😎 ${winner.name} 😎
                      Score: ${winner.score} | Rating: ${winner.elo - changeInELO} => ${winner.elo} (+${changeInELO})
                      
                      😤 ${loser.name} 😤
                      Score: ${loser.score} | Rating: ${loser.elo + changeInELO} => ${loser.elo} (-${changeInELO})

                      Return to the Main Menu to begin a new game.`
  });
}

function endGame (botResponse, msg, io, rm, openConnections) {
  let clients = io.nsps['/'].adapter.rooms[msg.roomId].sockets;
  let clientsArray = Object.keys(clients);
  console.log('CLIENTS:', clientsArray);

  let winner = findWinner(rm.p1, rm.p2);
  let loser = findLoser(rm.p1, rm.p2);
  // ELO changes
  let expectedScoreP1 = elo.expectedScoreP1(winner.elo, loser.elo);
  let changeInELO = Math.round(elo.changeInELO(winner.elo, expectedScoreP1, 1));

  loser.elo = loser.elo - changeInELO;
  if (loser.elo < 0) {
    loser.elo = 0;
  }
  winner.elo = winner.elo + changeInELO;
  elo.updateELOs(winner.fbId, winner.elo, loser.fbId, loser.elo);

  msg.type = 'correctGuess';
  io.sockets.in(msg.roomId).emit('message', msg);
  io.sockets.in(msg.roomId).emit('message', botResponse);

  // Emit winner/final scores.
  botResponse.text = `🏁 🏁 🏁 \xa0Game Completed 🏁 🏁 🏁
                      Congrats to the winner ${winner.name}!

                      Final Scores:
                      😎 ${winner.name} 😎
                      Score: ${winner.score} | Rating: ${winner.elo - changeInELO} => ${winner.elo} (+${changeInELO})
                      
                      😤 ${loser.name} 😤
                      Score: ${loser.score} | Rating: ${loser.elo + changeInELO} => ${loser.elo} (-${changeInELO})

                      Return to the Main Menu to begin a new game.`;

  io.sockets.in(msg.roomId).emit('message', botResponse);

  // Reset the room's data.
  rm.roundNum = 0;
  rm.prompt = '';
  rm.prompts = [];
  rm.hints = {};
  rm.solutions = {};
  rm.gameStarted = false;
  rm.gameFinished = true;

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
