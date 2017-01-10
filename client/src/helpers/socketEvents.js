import mixpanel from 'mixpanel-browser';

export function initSocketListeners () {
  this.socket.on('message', (message) => {
    console.log('Message from server:', message);
    this.setState({
      chats: [...this.state.chats, message],
      round: message.roundNum ? message.roundNum : this.state.round
    });
    if (message.type === 'correctGuess') {
      this.props.playSFX('correct');
      mixpanel.people.increment('Answered Correctly');
    } else if (message.type === 'incorrectGuess') {
      this.props.playSFX('incorrect');
      mixpanel.people.increment('Answered Wrong');
    } else {
      this.props.playSFX('chat');
    }
  });

  this.socket.on('newPrompt', solutionLength => {
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

  this.socket.on('playerJoinedRoom', (msg) => {
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
      roomExists: false
      // Set some kind of state to display a component that:
      // (a) tells the user that the room they're trying to access doesn't exist
      // (b) provides a link to direct them to the /mode screen to begin a new game
    });
  });

  this.socket.on('newHost', () => {
    this.props.setHost(true);
  });
}

export function createOrJoinRoom () {
  if (this.props.session.isHost) {
    this.socket.emit('createRoom', {
      roomId: this.state.roomId,
      user: this.props.users.profile.displayName,
      elo: this.props.users.profile.ELO,
      fbId: this.props.users.profile.auth,
      avatar: this.props.users.profile.imgUrl,
      type: this.props.session.roomType,
      totalRounds: this.props.session.roundCount,
      level: this.props.session.level ? this.props.session.level : 1 // TODO: Make it dynamic by adding level to Store.
    });
  } else {
    this.socket.emit('joinRoom', {
      roomId: this.state.roomId,
      user: this.props.users.profile.displayName,
      elo: this.props.users.profile.ELO,
      fbId: this.props.users.profile.auth,
      avatar: this.props.users.profile.imgUrl,
      type: this.props.session.roomType ? this.props.session.roomType : 'FRIENDS_VS_FRIENDS'
    });
  }
}

export function sendMessage () {
  if (this.state.userInput.length === 0) {
    return;
  }
  const userMessage = {
    user: this.state.user,
    text: this.state.userInput,
    imgUrl: this.props.users.profile.imgUrl,
    roomId: this.state.roomId
  };
  this.socket.emit('message', userMessage);
}
