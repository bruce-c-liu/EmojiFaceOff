const ignoredCodePoints = require('../helpers/ignoredCodePoints.js');
const RedisController = require('../../db/Redis/RedisController.js');

module.exports = {
  play: function (io, socket, clients, rm, msg) {
    if (rm.gameStarted && msg.text.codePointAt(0) > 0x03FF) {
      if (checkAnswer(msg.text, rm.prompt, rm.solutions)) {   // A user replied with a correct answer.
        if (rm.roundNum < rm.totalRounds) {
          nextRound(io, socket, clients, rm, msg);
        } else if (rm.roundNum === rm.totalRounds) { // Current game's selected round num has been reached.
          endGame(io, socket, clients, rm, msg);
        }
      } else {                                       // A user replied with an incorrect answer.
        wrongAnswer(io, msg);
      }
    } else {
      // Emit user's message to all sockets connected to this room.
      msg.type = 'chat';
      io.sockets.in(msg.roomId).emit('message', msg);
    }
  },

  startGame: function (io, socket, clients, rm, roomId) {
    let host = clients[socket.id];
    rm.gameStarted = true;
    rm.roundNum = 1;

    RedisController.getPrompts() // TODO: Get prompts by rm.level
      .then(filteredPrompts => {
        // randomly populate the room's "prompts" object (based on room's difficulty) from our library.
        while (rm.prompts.length < rm.totalRounds) {
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
            io.sockets.in(roomId).emit('gameStarted');
            socket.emit('newPrompt', {
              solutionLength: rm.hints[rm.prompt].length,
              prompt: rm.prompt
            });
            io.sockets.in(roomId).emit('message', {
              user: 'ebot',
              roundNum: rm.roundNum,
              text: `<em>${host.name} has started the game.</em>`
            });
            io.sockets.in(roomId).emit('message', {
              user: 'ebot',
              roundNum: rm.roundNum,
              text: `Round 1:
                     <em>${rm.prompt}</em>`
            });

            // TODO
            // let roundNum = 1;
            // setTimeout(() => {
            //   console.log('time out called:', roundNum, rm.roundNum);
            //   if (roundNum === rm.roundNum) {
            //     console.log('TIMED OUT!!!!!!!!!!!!');
            //   }
            // }, 7000);
          });
      });
  },

  createRoom: function (io, socket, rooms, data) {
    socket.join(data.roomId);
    let rm = rooms[data.roomId];
    Object.assign(rm, {
      gameStarted: false,
      level: data.level,
      totalRounds: data.totalRounds,
      roundNum: 0,
      prompt: '',
      prompts: [],
      solutions: {},
      hints: {},
      type: 'FRIENDS_VS_FRIENDS',
      host: socket.id                      // TODO: IMPLEMENT LATER?
    });
    socket.emit('playerJoinedRoom', {
      playerName: data.user,
      playerAvatar: data.avatar
    });
    socket.emit('message', {
      user: 'ebot',
      text: `You are the Host! Wait for friends to join before starting the game.

             You can send the current game url to friends at any time. 😎

             💩 - talk each other while you wait!`
    });
  },

  joinRoom: function (io, socket, rm, data) {
    let roomId = data.roomId;
    if (rm === undefined || rm.type !== 'FRIENDS_VS_FRIENDS') { // This room either: (a) does not exist OR (b) is NOT a FRIENDS_VS_FRIENDS room.
      socket.emit('roomDoesNotExist');                          // Technically the room may exist, but it doesn't matter to the user since they're not allowed to enter it.
      return;
    }

    // Room exists and it's a FRIENDS_VS_FRIENDS room.
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('message', {
      user: 'ebot',
      text: `${data.user} has joined the room!`
    });
    io.sockets.in(roomId).emit('playerJoinedRoom', {
      playerName: data.user,
      playerAvatar: data.avatar
    });

    if (!rm.gameStarted) {
      socket.emit('message', {
        user: 'ebot',
        text: `🎉 Welcome to Emoji Face Off! 🎉
              \xa0👩 \xa0 Mode: Friends vs Friends \xa0👨`
      });
      socket.emit('message', {
        user: 'ebot',
        text: `Wait for other friends to join the room.
               💩 - talk each other while you wait!`
      });
    } else if (rm.gameStarted) {
      socket.emit('gameStarted');
      socket.emit('newPrompt', {
        solutionLength: rm.hints[rm.prompt].length,
        prompt: rm.prompt
      });
      socket.emit('message', {
        user: 'ebot',
        text: `You joined a game that
               is already in progress!
               BETTER CATCH UP! 😱
               \n
               Round ${rm.roundNum}:
               <em>[${rm.prompt}]</em>`,
        roundNum: rm.roundNum
      });
    }
  },

  leaveRoom: function (io, socket, clients, rm) {
    let user = clients[socket.id];
    if (user.isHost) {
      let socketsInRoom = rm.sockets;
      let socketIDsInRoom = Object.keys(socketsInRoom);
      for (let id of socketIDsInRoom) {
        if (id !== socket.id) {
          io.to(id).emit('newHost');  // set that client as new host.
          clients[id].isHost = true;
          io.sockets.in(user.roomId).emit('message', {
            user: 'ebot',
            text: `${user.name} (Host) has left the room.
                   New host is now ${clients[id].name}.`
          });
          break;
        }
      }
    } else if (!user.isHost) {
      io.sockets.in(user.roomId).emit('message', {
        user: 'ebot',
        text: `${user.name} has left the room.`
      });
    }
  }
};

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

function nextRound (io, socket, clients, rm, msg) {
  clients[socket.id].score++;                           // Increment the user's score.
  msg.type = 'correctGuess';
  io.sockets.in(msg.roomId).emit('message', msg);
  rm.prompt = rm.prompts.pop();
  rm.roundNum++;

  io.sockets.in(msg.roomId).emit('newPrompt', {
    solutionLength: rm.hints[rm.prompt].length,
    prompt: rm.prompt
  });
  socket.emit('score', clients[socket.id].score);
  io.sockets.in(msg.roomId).emit('message', {
    user: 'ebot',
    roundNum: rm.roundNum,
    text: `Round ${rm.roundNum}:
           <em>${rm.prompt}</em>`
  });
}

// TODO: Handle cases of a tie.
function findWinner (socketIDs, allClients) {
  // Grab the winning socketID
  let socketID = socketIDs.reduce((winner, user) => {
    return allClients[user].score > allClients[winner].score
                                                ? user : winner;
  });

  return allClients[socketID];
}

function calcFinalRankings (socketIDs, allClients) {
  let finalRankings = [];
  socketIDs.forEach(id => {
    finalRankings.push(`${allClients[id].name}: ${allClients[id].score}`);
  });
  return finalRankings.join('\n');
}

function endGame (io, socket, clients, rm, msg) {
  clients[socket.id].score++;                           // Increment the user's score.
  let socketsInRoom = rm.sockets; // socketsInRoom is an object with socketid:socketInfo key-value pairs
  let socketIDsInRoom = Object.keys(socketsInRoom); // socketIDsInRoom contains the socket ids of all sockets in current room

  let winner = findWinner(socketIDsInRoom, clients);
  let finalRankings = calcFinalRankings(socketIDsInRoom, clients);

  // First, notify everyone the final answer was correct.
  msg.type = 'correctGuess';
  io.sockets.in(msg.roomId).emit('message', msg);

  // Reset all users' scores client side.
  io.sockets.in(msg.roomId).emit('score', 0);
  // Wipe clues on client side.
  io.sockets.in(msg.roomId).emit('newPrompt', {
    solutionLength: 0,
    prompt: rm.prompt
  });
  // Emit winner/final scores.
  io.sockets.in(msg.roomId).emit('message', {
    user: 'ebot',
    roundNum: rm.roundNum,
    text: `🏁 \xa0Game Completed 🏁

           Congrats ${winner.name}!

           Final Scores:
           ${finalRankings}

           Press Start Game to go again! 🙌`
  });
  io.sockets.in(msg.roomId).emit('gameEnded');

  // Reset the room's data.
  rm.roundNum = 0;
  rm.prompt = '';
  rm.prompts = [];
  rm.hints = {};
  rm.solutions = {};
  rm.gameStarted = false;

  // Reset all scores of players in this room to 0.
  for (let id of socketIDsInRoom) {
    clients[id].score = 0;
  }
}

function wrongAnswer (io, msg) {
  msg.type = 'incorrectGuess';
  io.sockets.in(msg.roomId).emit('message', msg);
}
