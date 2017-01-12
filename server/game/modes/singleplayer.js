const ignoredCodePoints = require('../helpers/ignoredCodePoints.js');
const RedisController = require('../../db/Redis/RedisController.js');

module.exports = {
  play: function (io, socket, clients, rm, msg) {
    if (rm.gameStarted && msg.text.codePointAt(0) > 0x03FF) {
      if (checkAnswer(msg.text, rm.prompt, rm.solutions)) {          // A user replied with a correct answer.
        if (rm.roundNum < rm.totalRounds) {
          nextRound(socket, clients, rm, msg);
        } else if (rm.roundNum === rm.totalRounds) {              // Current game's selected round num has been reached.
          endGame(socket, clients, rm, msg);
        }
      } else {                                       // A user replied with an incorrect answer.
        wrongAnswer(msg, io, rm);
      }
    } else {
      msg.type = 'chat';
      socket.emit('message', msg);
    }
  },

  createRoom: function (io, socket, rooms, data) {
    socket.join(data.roomId);
    let rm = rooms[data.roomId];
    Object.assign(rm, {
      gameStarted: false,
      level: data.level,
      roundNum: 0,
      totalRounds: data.totalRounds,
      prompt: '',
      prompts: [],
      solutions: {},
      hints: {},
      type: 'SINGLE_PLAYER'
    });
    socket.emit('playerJoinedRoom', {
      playerName: data.user,
      playerAvatar: data.avatar
    });
    socket.emit('message', {
      user: 'ebot',
      text: `Welcome to Emoji Face Off!
             🙏 \xa0Mode: Single Player 🙏

             Press Start Game to begin.`
    });
  },

  startGame: function (io, socket, rm) {
    rm.gameStarted = true;
    RedisController.getPrompts()      // TODO: CHANGE BACK to RedisController.getPrompts(rm.level)
      .then(filteredPrompts => {
        // randomly populate the room's "prompts" object from our library.
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

            console.log('Hints Object:', rm.hints);
            rm.prompt = rm.prompts.pop();
            rm.roundNum = 1;

            socket.emit('gameStarted');
            socket.emit('newPrompt', {
              solutionLength: rm.hints[rm.prompt].length,
              prompt: rm.prompt
            });
            socket.emit('score', 0);
            socket.emit('message', {
              user: 'ebot',
              roundNum: rm.roundNum,
              text: `Round 1: 
                     <em>${rm.prompt}</em>`
            });

            rm.startTime = Date.now();

            let roundNum = 1;
            setTimeout(() => {
              console.log('time out called:', roundNum, rm.roundNum);
              if (roundNum === rm.roundNum) {
                console.log('Failed to solve prompt within 7 seconds.');
              }
            }, 7000);
          });
      });
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

function nextRound (socket, clients, rm, msg) {
  clients[socket.id].score++;
  msg.type = 'correctGuess';
  socket.emit('message', msg);
  rm.prompt = rm.prompts.pop();
  rm.roundNum++;
  socket.emit('newPrompt', {
    solutionLength: rm.hints[rm.prompt].length,
    prompt: rm.prompt
  });
  socket.emit('score', clients[socket.id].score);
  socket.emit('message', {
    user: 'ebot',
    roundNum: rm.roundNum,
    text: `Round ${rm.roundNum}:
           <em>${rm.prompt}</em>`
  });
}

function endGame (socket, clients, rm, msg) {
  let timeElapsed = ((Date.now() - rm.startTime) / 1000).toFixed(2);
  let secondsPerRnd = (timeElapsed / rm.totalRounds).toFixed(2);

  clients[socket.id].score++;
  msg.type = 'correctGuess';
  socket.emit('message', msg);

  // Reset the room's data.
  rm.roundNum = 0;
  rm.prompt = '';
  rm.prompts = [];
  rm.hints = {};
  rm.solutions = {};
  rm.gameStarted = false;
  rm.startTime = null;

  socket.emit('message', {
    user: 'ebot',
    roundNum: rm.roundNum,
    text: `🏁 \xa0Game Completed 🏁

           ${timeElapsed} seconds to complete ${rm.totalRounds} rounds.
           ${secondsPerRnd} seconds / round.

           That was 💩\xa0...\xa0try harder next time!

           Press Start Game to go again! 🙌`
  });
  socket.emit('score', 0);
  socket.emit('newPrompt', {
    solutionLength: 0,
    prompt: ''
  });
  socket.emit('gameEnded');

  // Reset user's score to 0.
  clients[socket.id].score = 0;
}

function wrongAnswer (msg, io, rm) {
  msg.type = 'incorrectGuess';
  msg.roundNum = rm.roundNum;
  io.sockets.in(msg.roomId).emit('message', msg);
}
