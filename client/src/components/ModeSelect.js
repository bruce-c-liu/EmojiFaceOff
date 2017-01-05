import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
// import { browserHistory } from 'react-router';
// import { inviteBaseURL } from '../helpers/utils';
import Header from './Header';
import _ from 'lodash';

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

  initGameFriends (e) {
    e.preventDefault();
    this.props.fetchRoomId('friends');
    this.props.setRoomType('FRIENDS_VS_FRIENDS');
    this.props.setHost(true);
    this.props.playSFX('tap');
  }

  initGameRanked (e) {
    e.preventDefault();
    this.props.fetchRoomId('ranked', this.props.users.profile.auth);
    this.props.setRoomType('RANKED');
    this.props.playSFX('tap');
  }

  initGameSolo (e) {
    e.preventDefault();
    this.props.fetchRoomId('solo');
    this.props.setRoomType('SINGLE_PLAYER');
    this.props.setHost(true);
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
              <div className='avatar is-md' style={{backgroundImage: `url('http://static1.comicvine.com/uploads/original/11129/111293347/5489718-9865121372-52705.png')`}} />
              <div className='avatar is-md' style={{backgroundImage: `url('http://emojipedia-us.s3.amazonaws.com/cache/4b/93/4b932980a0fe8f7ad711a8c2fcc68ce4.png')`}} />
            </div>
            <button className='btn-login is-full' onClick={this.initGameFriends.bind(this)}>
              Challenge Your Friends!
            </button>
          </div>

          <div>
            <div className='mode-select_vs'>
              <div className='avatar is-md' style={avatarBG} />
              <div className='avatar is-md' style={{backgroundImage: `url('http://static1.comicvine.com/uploads/original/11129/111293347/5489718-9865121372-52705.png')`}} />
              <div className='avatar is-md' style={{backgroundImage: `url('http://emojipedia-us.s3.amazonaws.com/cache/41/ae/41aeea32dd8af702606e89afe2ac4b5e.png')`}} />
            </div>
            <button className='btn-login is-full' onClick={this.initGameRanked.bind(this)} >
                Ranked Mode
            </button>
          </div>

          <div>
            <div className='mode-select_vs'>
              <div className='avatar is-md' style={avatarBG} />
              <div className='avatar is-md' style={{backgroundImage: `url('http://static1.comicvine.com/uploads/original/11129/111293347/5489718-9865121372-52705.png')`}} />
              <div className='avatar is-md' style={{backgroundImage: `url('http://emojipedia-us.s3.amazonaws.com/cache/a5/43/a543b730ddcf70dfd638f41223e3969e.png')`}} />
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
