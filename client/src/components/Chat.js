import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import io from 'socket.io-client';
import Bubble from './Bubble';

let port = window.location.port;
let host = window.location.hostname;
let protocol = window.location.protocol;
let path = '/';
let url;
let options = {};

if (protocol.indexOf('https') > -1) {
  protocol = 'wss:';
} else {
  protocol = 'ws:';
}

url = protocol + '//' + host + ':' + port + path;

class Chat extends Component {

  constructor () {
    super();
    this.state = {
      message: '',
      user: 'PTR',
      roomId: null,
      round: '',
      score: null,
      chats: []
    };
    this.socket = io(url, options);
    this.socket.on('message', (message) => {
      console.log('INCOMING MESSAGE', message);
      this.setState({
        chats: [...this.state.chats, message],
        round: message.roundNum
      });
    });

    this.socket.on('score', score => {
      this.setState({
        score: score
      });
    });

    this.socket.on('roomJoined', (room) => {
      console.log('JOINED ROOM:', room);
    });
  }

  componentWillMount () {
    this.setState({
      roomId: this.props.params.roomID
    });
  }

  componentDidMount () {
    this.socket.emit('joinRoom', {
      roomId: this.state.roomId,
      user: this.state.user
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
    this.socket.emit('message', { user: this.state.user, text: 'start', roomId: this.state.roomId });
  }
  sendMessage (e) {
    e.preventDefault();
    const userMessage = { user: this.state.user, text: this.state.message, roomId: this.state.roomId };
    this.socket.emit('message', userMessage);
    this.props.playSFX('chime');
    this.setState({
      message: ''
    });
  }
  render () {
    const { users } = this.props;
    const chatList = this.state.chats.map((item, i) => {
      return <Bubble deets={item} profile={users.profile} key={i} />;
    });
    const startBtn = this.state.chats.length >= 1
                                ? null
                                : <button className='btn-start' onClick={this.startGame.bind(this)}>START</button>;

    return (

      <div className='chat-view'>
        <div className='chat-head' >
          {startBtn}

          <div className='flip-stat'>
            <p> ROUND</p>
            <CSSTransitionGroup
              transitionName='count'
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}
              >
              <span key={this.state.round} >{this.state.round}</span>
            </CSSTransitionGroup>
          </div>
          <div className='flip-stat'>
            <p> SCORE</p>
            <CSSTransitionGroup
              transitionName='count'
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}
              >
              <span key={this.state.score} >{this.state.score}</span>
            </CSSTransitionGroup>
          </div>

        </div>

        <div className='chat-messages' ref='chatScroll'>
          {chatList}
        </div>

        <form className='chat-form' onSubmit={this.sendMessage.bind(this)}>
          <input type='text' value={this.state.message}
            onChange={this.handleChange.bind(this)}
            placeholder='Your Message Here' />
          <input className='btn-input' type='submit' value='Submit' />
        </form>
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
