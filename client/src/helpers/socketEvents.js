this.socket.on('message', (message) => {
  console.log('Message from server:', message);
  this.setState({
    chats: [...this.state.chats, message],
    round: message.roundNum
  });
});

this.socket.on('newRound', solutionLength => {
  this.setState({
    solution: Array(solutionLength).fill(''),
    clueCount: 0
  });
});

this.socket.on('hint', hint => {
  this.state.solution[this.state.clueCount] = hint;
  this.setState({
    clueCount: ++this.state.clueCount
  });
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
  this.setState({
    gameStarted: false
  });
});

  /* msg = {
      room: (string) roomId joined
      playerAvatar: (string) avatar URL
      playerName: (string) player's name who just joined
  } */
this.socket.on('roomJoined', (msg) => {
  console.log('Server confirms this socket joined room:', msg.room);
  this.setState({
    joinedPlayer: msg.playerName,
    joinedAvatar: msg.playerAvatar,
    announceBar: true
  });
  this.props.playSFX('enter');
  setTimeout(() => {
    this.setState({
      announceBar: false
    });
  }, 2000);
});