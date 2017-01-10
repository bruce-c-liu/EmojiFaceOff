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
import OnBoard from '../UI/OnBoard';
import Modal from '../UI/Modal';
import { initSocketListeners, createOrJoinRoom, sendMessage } from '../../helpers/socketEvents.js';
import mixpanel from 'mixpanel-browser';
class Chat extends Component {
  constructor () {
    super();
    this.state = {
      user: '',
      userInput: '',
      roomId: null,
      round: 0,
      score: 0,
      chats: [],
      solution: [],
      numHintsReceived: 0,
      gameStarted: false,
      joinedPlayer: null,
      joinedAvatar: 'http://emojipedia-us.s3.amazonaws.com/cache/a5/43/a543b730ddcf70dfd638f41223e3969e.png',
      announceBar: false,
      coinBalance: null,
      hasFocus: false,
      roomExists: true
    };
    this.socket = io(socketURL);
    initSocketListeners.call(this);
  }

  componentWillMount () {
    this.setState({
      roomId: this.props.params.roomID,
      user: this.props.users.profile.displayName,
      coinBalance: this.props.users.profile.coins
    });
  }

  componentDidMount () {
    createOrJoinRoom.call(this);
    mixpanel.track('Nav Chat');
  }

  componentDidUpdate () {
    const node = this.refs.chatScroll;
    node.scrollTop = node.scrollHeight + 300;
  }

  componentWillUnmount () {
    this.props.setHost(false);
    this.props.setRoomType(null);
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
    mixpanel.track('Game Start');
    mixpanel.people.increment('Games Started');
    this.props.playSFX('chime');
    this.socket.emit('startGame', this.state.roomId);
  }
  sendMessage (e) {
    e.preventDefault();
    sendMessage.call(this);

    if (this.state.userInput.codePointAt(0) > 0x03FF && this.state.gameStarted) {
      mixpanel.people.increment('Answer Attempt');
    }

    this.setState({
      userInput: '',
      hasFocus: true
    });
  }
  requestHint (e) {
    // e.preventDefault();
    e.persist();
    mixpanel.track('Click Hints');
    mixpanel.people.increment('Hints Requsted');
    this.socket.emit('hint', { roomId: this.state.roomId, index: this.state.numHintsReceived });
    this.props.playSFX('hint');
    this.props.spendCoins(this.props.users.profile.auth);
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
                                ? <ChatHead deets={this.state} coinBal={this.state.coinBalance} />
                                : <ChatHeadPractice deets={this.state} roomType={this.props.session.roomType} hostStatus={this.props.session.isHost} startProp={this.startGame.bind(this)} />;
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
        <Modal modalOpen={!this.state.roomExists}>
          <p className='lead'>You have entered an inactive room. Please click on the link below to start a new game.</p>
        </Modal>
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
