import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
// import { browserHistory } from 'react-router';
import mixpanel from 'mixpanel-browser';
import Header from './Header';
import _ from 'lodash';
import emoji_nerd from '../assets/emoji_nerd.png';
import icon_friends from '../assets/glyph_friends.png';

class ModeSelect extends Component {
  constructor () {
    super();
    this.state = {
      tempUser: null
    };
  }

  componentWillMount () {
    const lsItems = Object.keys(window.localStorage);
    let profKey = null;
    lsItems.forEach(item => {
      if (_.startsWith(item, 'firebase:authUser')) {
        profKey = item;
      }
    });
    let aValue = window.localStorage.getItem(profKey);
    this.setState({
      tempUser: JSON.parse(aValue)
    });
  }

  componentDidMount () {
    mixpanel.track('Nav Mode');
  }

  initGameFriends (e) {
    e.preventDefault();
    mixpanel.track('Click Multiplayer');
    this.props.setRoomType('FRIENDS_VS_FRIENDS');
    this.props.setHost(true);
    this.props.fetchRoomId('friends');
    this.props.playSFX('tap');
  }

  initGameRanked (e) {
    e.preventDefault();
    mixpanel.track('Click Ranked');
    this.props.fetchRoomId('ranked', this.props.users.profile.ELO);
    this.props.setRoomType('RANKED');
    this.props.playSFX('tap');
  }

  initGameSolo (e) {
    e.preventDefault();
    mixpanel.track('Click Solo');
    this.props.setRoomType('SINGLE_PLAYER');
    this.props.setHost(true);
    this.props.fetchRoomId('solo');
    this.props.playSFX('tap');
  }

  render () {
    // const {users} = this.props
   // const avatarSrc = users.profile.info.avatar
    const avatarBG = {
      backgroundImage: `url(${this.state.tempUser.photoURL})`
    };

    return (
      <div className='inner-container is-center'>
        <Header />
        <div className='mode-select_wrap'>
          <h1> Select Game Mode</h1>

          <div>
            <div className='mode-select_vs'>
              <div className='avatar is-md' style={avatarBG} />
              <h4>vs</h4>
              <div className='avatar is-md' style={{backgroundImage: `url(${icon_friends})`}} />
            </div>
            <button className='btn-login is-full' onClick={this.initGameFriends.bind(this)}>
              Challenge Your Friends!
            </button>
          </div>

          <div>
            <div className='mode-select_vs'>
              <div className='avatar is-md' style={avatarBG} />
              <h4>vs</h4>
              <div className='avatar is-md' style={{backgroundImage: `url(${emoji_nerd})`}} />
            </div>
            <button className='btn-login is-full' onClick={this.initGameSolo.bind(this)} >
                Single Player Mode
            </button>
          </div>

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
export default connect(mapStateToProps, mapDispachToProps)(ModeSelect);
