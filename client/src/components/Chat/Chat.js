import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {Motion, spring} from 'react-motion';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators.js';
import io from 'socket.io-client';
import {socketURL} from '../../helpers/utils.js';
import ChatHead from './ChatHead';
import Bubble from './Bubble';
import { getUser } from '../../helpers/http.js';

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
      gameStarted: false
    };
    this.socket = io(socketURL);

    this.socket.on('message', (message) => {
      console.log('INCOMING MESSAGE', message);
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

    this.socket.on('roomJoined', (room) => {
      console.log('Server confirms this socket joined room:', room);
    });
  }

  componentWillMount () {
    this.setState({
      roomId: this.props.params.roomID,
      user: this.props.users.profile.info.name
    });
  }

  componentDidMount () {
    getUser(this.props.users.profile.info.uid)
      .then(result => {
        console.log('CURRENT USER FROM DB:', result.data);
        this.socket.emit('joinRoom', {
          roomId: this.state.roomId,
          user: this.state.user,
          elo: result.data.ELO,
          fbId: result.data.auth,
          type: 'FRIENDS_VS_FRIENDS' // CHANGE THIS TO BE DYNAMIC LATER. Options: 'SINGLE_PLAYER', 'FRIENDS_VS_FRIENDS', 'RANKED'
        });
      });
  }

  componentDidUpdate () {
    const node = this.refs.chatScroll;
    node.scrollTop = node.scrollHeight + 200;
  }

  handleChange (e) {
    this.setState({
      message: e.target.value
    });
  }

  startGame (e) {
    e.preventDefault();
    this.props.playSFX('chime');
    this.socket.emit('message', { user: this.state.user, text: 'start', imgUrl: this.props.users.profile.info.avatar, roomId: this.state.roomId });
  }
  sendMessage (e) {
    e.preventDefault();

    const userMessage = {
      user: this.state.user,
      text: this.state.message,
      imgUrl: this.props.users.profile.info.avatar,
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
  }

  render () {
    const { users } = this.props;
    const chatList = this.state.chats.map((item, i) => {
      return <Bubble deets={item} profile={users.profile} key={i} />;
    });
    const chatHeadElements = this.state.gameStarted
                                ? <ChatHead deets={this.state} />
                                : <button className='btn-start' onClick={this.startGame.bind(this)}>START</button>;
    const hintMax = this.state.solution.length && this.state.solution.length >= this.state.clueCount;

    return (

      <div className='chat-view'>
        <div className='chat-head'>
          {chatHeadElements}
        </div>
        <div className='chat-messages' ref='chatScroll'>
          {chatList}
        </div>
        <div className="chat-form_wrap">
            <button className='btn-hint' 
                                    onClick={this.requestHint.bind(this)}
                                    disabled={this.state.clueCount >= this.state.solution.length} > ?</button>
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
