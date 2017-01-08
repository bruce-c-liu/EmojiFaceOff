const ignoredCodePoints = require('../helpers/ignoredCodePoints.js');

module.exports = {
  play: function (io, msg, RedisController, openConnections, socket) {
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];

    let botResponse = { user: 'ebot' };
    if (rm.gameStarted && msg.text.codePointAt(0) > 0x03FF) {
      if (checkAnswer(msg.text, rm.prompt, rm.solutions)) {          // A user replied with a correct answer.
        openConnections[socket.id].score++;                           // Increment the user's score.
        if (rm.roundNum < rm.totalRounds) {
          nextRound(botResponse, msg, io, rm, openConnections, socket);
        } else if (rm.roundNum === rm.totalRounds) {              // Current game's selected round num has been reached.
          endGame(botResponse, msg, io, socket, openConnections, rm);
        }
      } else {                                       // A user replied with an incorrect answer.
        wrongAnswer(msg, io, rm);
      }
    } else {
      msg.type = 'chat';
      msg.roundNum = rm.roundNum;
      socket.emit('message', msg);
    }
  },

  createRoom: function (msg, io, socket, TESTING_DIFFICULTY) {
    socket.join(msg.roomId);
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];
    Object.assign(rm, {
      level: TESTING_DIFFICULTY,
      roundNum: 0,
      totalRounds: msg.totalRounds,
      prompt: '',
      prompts: [],
      solutions: {},
      hints: {},
      type: msg.type,               // options: 'SINGLE_PLAYER', 'FRIENDS_VS_FRIENDS', 'RANKED'
      host: ''                      // IMPLEMENT LATER
    });
    console.log('Joined room:', msg.roomId);
    socket.emit('playerJoinedRoom', {
      room: msg.roomId,
      playerName: msg.user,
      playerAvatar: msg.avatar
    });
    console.log('Sockets in this room:', io.nsps['/'].adapter.rooms[msg.roomId].sockets);
    socket.emit('message', {
      user: 'ebot',
      text: `\xa0\xa0🎉 Welcome to Emoji Face Off! 🎉\xa0\xa0
             \xa0\xa0\xa0\xa0\xa0\xa0\xa0 🙏 Mode: Single Player 🙏
             
             \xa0\xa0\xa0\xa0 Press Start when you're ready.`
    });
  },

  startGame: function (msg, io, socket, RedisController) {
    let botResponse = { user: 'ebot' };
    let rm = io.nsps['/'].adapter.rooms[msg.roomId];
    rm.gameStarted = true;
    RedisController.getPrompts()      // CHANGE BACK LATER: RedisController.getPrompts(rm.level)
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
            botResponse.text = `Round 1: Emojify [${rm.prompt}] ! 🤔`;
            rm.roundNum = 1;
            botResponse.roundNum = rm.roundNum;

            socket.emit('gameStarted');
            socket.emit('newRound', rm.hints[rm.prompt].length);
            socket.emit('score', 0);
            socket.emit('message', botResponse);

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
  socket.emit('message', msg);
  rm.prompt = rm.prompts.pop();
  rm.roundNum++;
  botResponse.text = `Round ${rm.roundNum}: Emojify [${rm.prompt}] ! 🤔`;
  botResponse.roundNum = rm.roundNum;
  socket.emit('newRound', rm.hints[rm.prompt].length);
  socket.emit('score', openConnections[socket.id].score);
  socket.emit('message', botResponse);
}

function endGame (botResponse, msg, io, socket, openConnections, rm) {
  let timeElapsed = ((Date.now() - rm.startTime) / 1000).toFixed(2);
  let secondsPerRnd = (timeElapsed / rm.totalRounds).toFixed(2);

  msg.type = 'correctGuess';
  io.sockets.in(msg.roomId).emit('message', msg);
  // // First, notify everyone the final answer was correct.
  // botResponse.text = `Good job, ${msg.user} won Round ${rm.roundNum}!`;
  // socket.emit('message', botResponse);

  // Reset all users' scores
  socket.emit('score', null);
  // Emit winner/final scores.
  botResponse.text = `🏁 🏁 🏁 \xa0Game Completed 🏁 🏁 🏁
                      
                      ${timeElapsed} seconds to complete ${rm.totalRounds} rounds.
                      ${secondsPerRnd} seconds / round.

                      That was 💩\xa0...\xa0try harder next time!

                      Press 'start' to begin a new game. 🙌`;
  socket.emit('newRound', 0);
  socket.emit('message', botResponse);
  socket.emit('gameEnded');

  // Reset the room's data.
  rm.roundNum = 0;
  rm.prompt = '';
  rm.prompts = [];
  rm.hints = {};
  rm.solutions = {};
  rm.gameStarted = false;
  rm.startTime = null;

  // Reset user's score to 0.
  openConnections[socket.id].score = 0;
}

function wrongAnswer (msg, io, rm) {
  msg.type = 'incorrectGuess';
  msg.roundNum = rm.roundNum;
  io.sockets.in(msg.roomId).emit('message', msg);
}
