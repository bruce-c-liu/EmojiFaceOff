import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators.js';
import io from 'socket.io-client';
import {socketURL} from '../../helpers/utils.js';
import ChatHead from './ChatHead';
import ChatHeadPractice from './ChatHeadPractice';
import Bubble from './Bubble';
import HintBar from './HintBar';

class Chat extends Component {

  constructor () {
    super();
    this.state = {
      user: '',
      userInput: '',
      roomId: null,
      round: '',
      score: null,
      chats: [],
      solution: [],
      numHintsReceived: 0,
      gameStarted: false,
      joinedPlayer: null,
      joinedAvatar: 'http://emojipedia-us.s3.amazonaws.com/cache/a5/43/a543b730ddcf70dfd638f41223e3969e.png',
      announceBar: false,
      coinBalance: 1000,
      hasFocus: false
    };
    this.socket = io(socketURL);

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
        numHintsReceived: 0
      });
    });

    this.socket.on('hint', hint => {
      let newSolutionsArray = this.state.solution.slice();
      newSolutionsArray[this.state.numHintsReceived] = hint;
      let newNumHintsReceived = this.state.numHintsReceived + 1;
      this.setState({
        solution: newSolutionsArray,
        numHintsReceived: newNumHintsReceived
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
        joinedAvatar: msg.playerAvatar
      });
      this.props.playSFX('enter');
      this.announceNewPlayer();
    });
  }

  componentWillMount () {
    this.setState({
      roomId: this.props.params.roomID,
      user: this.props.users.profile.displayName
    });
  }

  componentDidMount () {
    this.socket.emit('joinOrCreateRoom', {
      roomId: this.state.roomId,
      user: this.props.users.profile.displayName,
      elo: this.props.users.profile.ELO,
      fbId: this.props.users.profile.auth,
      avatar: this.props.users.profile.imgUrl,
      type: this.props.session.roomType ? this.props.session.roomType : 'FRIENDS_VS_FRIENDS'
    });
  }

  componentDidUpdate () {
    const node = this.refs.chatScroll;
    node.scrollTop = node.scrollHeight + 300;
  }

  componentWillUnmount () {
    this.socket.disconnect();
  }

  announceNewPlayer () {
    this.setState({
      announceBar: true
    });
    setTimeout(() => {
      this.setState({
        announceBar: false
      });
    }, 3500);
  }

  handleChange (e) {
    this.setState({
      userInput: e.target.value
    });
  }
  handleFocus () {
    this.setState({
      hasFocus: true
    });
  }
  toggleMenu () {
    this.props.toggleDrawer();
  }

  startGame (e) {
    e.preventDefault();
    this.props.playSFX('chime');
    this.socket.emit('startGame', { user: this.state.user, roomId: this.state.roomId });
  }
  sendMessage (e) {
    e.preventDefault();

    const userMessage = {
      user: this.state.user,
      text: this.state.userInput,
      imgUrl: this.props.users.profile.imgUrl,
      roomId: this.state.roomId
    };

    this.socket.emit('message', userMessage);
    this.props.playSFX('message');
    this.setState({
      userInput: '',
      hasFocus: false
    });
  }
  requestHint (e) {
    e.preventDefault();
    this.socket.emit('hint', { roomId: this.state.roomId, index: this.state.numHintsReceived });
    this.props.playSFX('hint');
    this.setState({
      coinBalance: this.state.coinBalance - 30
    });
  }

  render () {
    const { users } = this.props;
    const chatList = this.state.chats.map((item, i) => {
      return <Bubble deets={item} profile={users.profile} key={i} />;
    });
    const chatHeadElements = this.state.gameStarted
                                ? <ChatHead deets={this.state} />
                                : <ChatHeadPractice deets={this.state} hostStatus={this.props.session.isHost} startProp={this.startGame.bind(this)} />;
    const hintMax = this.state.solution.length && this.state.solution.length >= this.state.clueCount;
    const avatarBG = {
      backgroundImage: `url(${this.state.joinedAvatar})`,
      position: 'relative',
      right: 0,
      height: '45px',
      width: '45px'
    };
    const annouceClass = classNames({
      'player-announce': true,
      'is-showing': this.state.announceBar
    });
    const chatMsgClass = classNames({
      'chat-messages': true,
      'has-focus': this.state.hasFocus
    });
    const hamburgerClass = classNames({
      'hamburger hamburger--elastic': true,
      'is-active': this.props.ui.drawer
    });

    return (

      <div className='chat-view'>
        <div className='chat-head'>
          {chatHeadElements}
          <button className={hamburgerClass} onClick={this.toggleMenu.bind(this)} type='button' >
            <span className='hamburger-box'>
              <span className='hamburger-inner' />
            </span>
          </button>
        </div>
        <div className={annouceClass}>
          <div className='bubble-name' style={avatarBG} />
          <p><span>{this.state.joinedPlayer}</span> has joined the challenge!</p>
        </div>
        <div className={chatMsgClass} ref='chatScroll'>
          {chatList}
        </div>
        <div className='hint-bar'>
          <HintBar hintInfo={this.state} clickHint={this.requestHint.bind(this)} />
        </div>
        <div className='chat-form_wrap'>

          <form className='chat-form' onSubmit={this.sendMessage.bind(this)}>
            <input type='text'
              value={this.state.userInput}
              onChange={this.handleChange.bind(this)}
              onFocus={this.handleFocus.bind(this)}
              placeholder='Your Message Here' />
            <input className='btn-input' type='submit' value='Submit' />
          </form>
        </div>

      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    users: state.users,
    ui: state.ui,
    session: state.session
  };
}

function mapDispachToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispachToProps)(Chat);
