import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { TransitionMotion, spring, presets } from 'react-motion';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import { inviteBaseURL } from '../helpers/utils';
import btnIcon from '../assets/Messenger_Icon.png';
import { browserHistory } from 'react-router';
import OnBoard from './OnBoard';


class Invite extends Component {
  constructor () {
    super();
    this.state = {
      inviteCount: 1,
      longRoomURL: null,
      shortRoomURL: null,
      onBoard: false
    };
  }

  componentWillMount () {
    this.setState({
      longRoomURL: inviteBaseURL + this.props.session.roomID
    });
  }
  componentDidMount () {
    this.props.fetchBitlyLink(this.state.longRoomURL);
  }

  InviteCountInc () {
    if (this.props.session.inviteCount < 6) {
      this.props.counterInc();
      this.props.playSFX('tick');
    }
  }

  InviteCountDec () {
    console.log('INC INVITE');
    if (this.props.session.inviteCount >= 2) {
      this.props.counterDec();
      this.props.playSFX('tick');
    }
  }

  inviteBySms (e) {
    e.preventDefault();
    let userName = this.props.users.profile.info.name;
    let roomUrl = this.props.session.inviteURL;
    let numbers = ReactDOM.findDOMNode(this.refs.toSMS).value.split(',');
    this.props.sendSMS(userName, roomUrl, numbers);
  }


  popModal(e){
    this.setState({
      onBoard: true
    });

  }

  render () {
    const encodedURL = `fb-messenger://share/?link=http%3A%2F%2Femojifaceoff.herokuapp.com%2Fchat%2F${this.props.session.roomID}`;
    const loaderUI = this.props.ui.loading
                            ? <div className='loader'><p>Sending Invitation</p></div>
                            : null;
    return (
      <div className='inner-container is-center invite-wrap'>
        {this.state.longRoomURL}
        <p> How many friends would you like to invite in this game?</p>
        <div className='count-selector'>
          <i className='ion-chevron-down' onClick={this.InviteCountDec.bind(this)} />
          <CSSTransitionGroup
            component='span'
            className='count-digit'
            transitionName='count'
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
          >
            <span key={this.props.session.inviteCount} >{this.props.session.inviteCount}</span>
          </CSSTransitionGroup>
          <i className='ion-chevron-up' onClick={this.InviteCountInc.bind(this)} />
        </div>

        <form className='form-sms' onSubmit={this.inviteBySms.bind(this)} >
          <div className='input-inline'>
            <i className='ion-android-call' />
            <input type='tel' ref='toSMS' placeholder='Invite by text message' />
            <button className='btn-input'>Send</button>
          </div>
        </form>
        <h6 className='or-split'>OR</h6>

        <a className='btn-fbshare' href={encodedURL} onClick={this.popModal.bind(this)}>
          <img src={btnIcon} alt='' />INVITE FACEBOOK FRIENDS
        </a>

        {loaderUI}
        <OnBoard show={this.state.onBoard} roomLink={this.props.session.roomID}/>
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
export default connect(mapStateToProps, mapDispachToProps)(Invite);
