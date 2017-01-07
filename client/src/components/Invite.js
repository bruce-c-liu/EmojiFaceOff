import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import { inviteBaseURL } from '../helpers/utils';
import CopyToClipboard from 'react-copy-to-clipboard';
import btnIcon from '../assets/Messenger_Icon.png';
import Header from './Header';
import OnBoard from './OnBoard';
import Modal from './UI/Modal';

class Invite extends Component {
  constructor () {
    super();
    this.state = {
      inviteCount: 1,
      longRoomURL: null,
      shortRoomURL: null,
      onBoard: false,
      copied: false,
      copyContent: 'TEST THIS COPY'
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
    let userName = this.props.users.profile.displayName;
    let roomUrl = this.props.session.inviteURL;
    let numbers = ReactDOM.findDOMNode(this.refs.toSMS).value.split(',');
    this.props.sendSMS(userName, roomUrl, numbers);
  }

  popModal (e) {
    this.setState({
      onBoard: true
    });
  }

  render () {
    const { session } = this.props;
    const encodedURL = `fb-messenger://share/?link=http%3A%2F%2Femojifaceoff.herokuapp.com%2Fchat%2F${this.props.session.roomID}`;
    const loaderUI = this.props.ui.loading
                            ? <div className='loader'><p>Sending Invitation</p></div>
                            : null;
    const clipboardData=
`${this.props.users.profile.displayName} is challenging you to an Emoji Faceoff.
Click here to Play: ${this.state.longRoomURL}`

    return (
      <div className='inner-container is-center invite-wrap'>
        <Header />
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
        <CopyToClipboard text={clipboardData}
                  onCopy={() => this.setState({copied: true, })}>
                  <button>Copy to clipboard with button</button>
        </CopyToClipboard>
        <h6 className='or-split'>OR</h6>

        <a className='btn-fbshare' href={encodedURL} onClick={this.popModal.bind(this)}>
          <img src={btnIcon} alt='' />INVITE FACEBOOK FRIENDS
        </a>

        {loaderUI}
        <OnBoard show={this.state.onBoard} roomLink={this.props.session.roomID} />
        <Modal modalOpen={this.state.copied} toggleModal={()=>this.setState({copied: !this.state.copied})}>
            <span className="emoji-glyph">👍</span>
            <h1 className="font-display">Invite Link Copied!</h1>
            <ul className="steps-list">
              <li><span>1</span> Open your text message app</li>
              <li><span>2</span> Text the invite link out to friends</li>
              <li><span>3</span> Come back here and Start Game!</li>
            </ul>
            <Link to={`/chat/${session.roomID}`} className="btn-login">
                Start Game <span>🎉🏁</span>
              </Link>
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
export default connect(mapStateToProps, mapDispachToProps)(Invite);
