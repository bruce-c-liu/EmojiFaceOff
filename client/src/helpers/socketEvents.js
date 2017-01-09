import mixpanel from 'mixpanel-browser';

export function initSocketListeners () {
  this.socket.on('message', (message) => {
    console.log('Message from server:', message);
    this.setState({
      chats: [...this.state.chats, message],
      round: message.roundNum ? message.roundNum : this.state.round
    });
    if (message.type === 'correctGuess') {
      mixpanel.people.increment('Answered Correctly');
    }else {
      mixpanel.people.increment('Answered Wrong');
    }
  });

  this.socket.on('newRound', solutionLength => {
    this.setState({
      solution: Array(solutionLength).fill(''),
      numHintsReceived: 0
    });
  });

  this.socket.on('hint', hint => {
    let newSolutionsArray = this.state.solution.slice();
    newSolutionsArray[this.state.numHintsReceived] = hint;
    this.setState({
      solution: newSolutionsArray,
      numHintsReceived: this.state.numHintsReceived + 1
    });
    if (this.state.numHintsReceived === this.state.solution.length) {
      this.setState({
        userInput: this.state.solution.join('')
      });
    }
  });

  this.socket.on('score', score => {
    this.setState({
      score: score
    });
  });

  this.socket.on('gameStarted', () => {
    this.setState({
      gameStarted: true
    });
  });

  this.socket.on('gameEnded', () => {
    mixpanel.track('Game End');
    mixpanel.people.increment('Games Finished');
    this.setState({
      gameStarted: false
    });
  });

    /* msg = {
        room: (string) roomId joined
        playerAvatar: (string) avatar URL
        playerName: (string) player's name who just joined
    } */
  this.socket.on('playerJoinedRoom', (msg) => {
    console.log('Server confirms this socket joined room:', msg.room);
    this.setState({
      joinedPlayer: msg.playerName,
      joinedAvatar: msg.playerAvatar
    });
    this.props.playSFX('enter');
    this.announceNewPlayer();
  });

  this.socket.on('roomDoesNotExist', () => {
    console.log('User tried to access a room that does not exist.');
    this.setState({
      // Set some kind of state to display a component that:
      // (a) tells the user that the room they're trying to access doesn't exist
      // (b) provides a link to direct them to the /mode screen to begin a new game
    });
  });

  this.socket.on('newHost', () => {
    this.props.setHost(true);
  });
}
