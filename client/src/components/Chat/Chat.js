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
import { dequeueRankedRoom } from '../../helpers/http.js';

class Chat extends Component {

  constructor () {
    super();
    this.state = {
      message: '',
      user: '',
      roomId: null,
      round: '',
      score: null,
      chats: [],
      solution: [],
      clueCount: 0,
      gameStarted: false,
      joinedPlayer: null,
      joinedAvatar: 'http://emojipedia-us.s3.amazonaws.com/cache/a5/43/a543b730ddcf70dfd638f41223e3969e.png',
      announceBar: false,
      coinBalance: 1000
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
  }

  componentWillMount () {
    this.setState({
      roomId: this.props.params.roomID,
      user: this.props.users.profile.displayName
    });
    console.log(this.props.users);
  }

  componentDidMount () {
    let obj = {
      roomId: this.state.roomId,
      user: this.state.user,
      elo: this.props.users.profile.ELO,
      fbId: this.props.users.profile.auth,
      avatar: this.props.users.profile.imgUrl,
      type: this.props.session.roomType ? this.props.session.roomType : 'FRIENDS_VS_FRIENDS'
    };
    console.log('COMPONENT DID MOUNT Pt.2', obj);
    this.socket.emit('joinRoom', obj);
  }

  componentDidUpdate () {
    const node = this.refs.chatScroll;
    node.scrollTop = node.scrollHeight + 300;
  }

  componentWillUnmount () {

  }

  announceNewPlayer () {
    this.setState({
      announceBar: true
    });
  }

  handleChange (e) {
    this.setState({
      message: e.target.value
    });
  }

  startGame (e) {
    console.log('startGame');
    e.preventDefault();
    this.setState({
      gameStarted: true
    });
    this.props.playSFX('chime');
    this.socket.emit('startGame', { user: this.state.user, roomId: this.state.roomId });
  }
  sendMessage (e) {
    e.preventDefault();

    const userMessage = {
      user: this.state.user,
      text: this.state.message,
      imgUrl: this.props.users.profile.imgUrl,
      roomId: this.state.roomId
    };

    this.socket.emit('message', userMessage);
    this.props.playSFX('message');
    this.setState({
      message: ''
    });
  }
  requestHint (e) {
    e.preventDefault();
    this.socket.emit('hint', {roomId: this.state.roomId, index: this.state.clueCount});
    this.props.playSFX('hint');
    this.setState({
      coinBalance: this.state.coinBalance -= 30
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

    return (

      <div className='chat-view'>
        <div className='chat-head'>
          {chatHeadElements}
        </div>
        <div className={annouceClass}>
          <div className='bubble-name' style={avatarBG} />
          <p>{this.state.joinedPlayer} has joined the challenge!</p>
        </div>
        <div className='chat-messages' ref='chatScroll'>
          {chatList}
        </div>
        <div className='hint-bar'>
          <HintBar hintInfo={this.state} clickHint={this.requestHint.bind(this)} />
        </div>
        <div className='chat-form_wrap'>

          <form className='chat-form' onSubmit={this.sendMessage.bind(this)}>
            <input type='text' value={this.state.message}
              onChange={this.handleChange.bind(this)}
              placeholder='Your Message Here' />
            <input className='btn-input' type='submit' value='Submit' disabled={this.state.message.length <= 0} />
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
