import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Transition from 'react-motion-ui-pack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators.js';
import io from 'socket.io-client';
import {socketURL} from '../../helpers/utils.js';
import ChatHead from './ChatHead';
import Bubble from './Bubble';

class Chat extends Component {

  constructor () {
    super();
    this.state = {
      message: '',
      user: 'Patty-Pat-Pat',
      roomId: null,
      round: '',
      score: null,
      chats: [],
      solution: ['', '', ''],
      clueCount: 0
    };
    this.socket = io(socketURL);

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
      console.log('Server confirms this socket joined room:', room);
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

  // componentDidUpdate () {
  //   const node = this.refs.chatScroll;
  //   node.scrollTop = node.scrollHeight + 200;
  // }

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
    this.props.playSFX('message');
    this.setState({
      message: ''
    });
  }
  requestHint (e) {
    e.preventDefault();
    this.state.solution[this.state.clueCount] = '😃';
    this.setState({
      clueCount: ++this.state.clueCount
    });
    this.props.playSFX('hint');
  }
  render () {
    const { users } = this.props;
    const chatList = this.state.chats.map((item, i) => {
      return <Bubble deets={item} profile={users.profile} key={i} />;
    });
    const chatHeadElements = this.state.chats.length >= 1
                                ? <ChatHead deets={this.state} start={this.startGame} />
                                : <button className='btn-start' onClick={this.startGame.bind(this)}>START</button>;

    return (

      <div className='chat-view'>
        <div className='chat-head'>
          {chatHeadElements}
        </div>

        <Transition
          component='div'
          className='chat-messages'
          ref=''
          enter={{
            transform: 'scale(1)'
          }}
          leave={{
            opacity: 0
          }}
          >
          {chatList}
        </Transition>

        <form className='chat-form' onSubmit={this.sendMessage.bind(this)}>
          <button className='btn-hint' onClick={this.requestHint.bind(this)}>?</button>
          <input type='text' value={this.state.message}
            onChange={this.handleChange.bind(this)}
            placeholder='Your Message Here' />
          <input className='btn-input' type='submit' value='Submit' disabled={this.state.message.length <= 0} />
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
