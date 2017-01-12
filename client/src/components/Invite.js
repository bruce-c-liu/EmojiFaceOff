import React, { Component } from 'react';
import {Motion, spring, presets} from 'react-motion';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import { inviteBaseURL, loading } from '../helpers/utils';
import CopyToClipboard from 'react-copy-to-clipboard';
import ClipboardButton from 'react-clipboard.js';
import btnIcon from '../assets/Messenger_Icon.png';
import Header from './Header';
import Modal from './UI/Modal';
import mixpanel from 'mixpanel-browser';
import stop_sign from '../assets/stop_hand.svg';
import ProgressBar from './UI/ProgressBar';

class Invite extends Component {
  constructor () {
    super();
    this.state = {
      roundCount: 5,
      longRoomURL: null,
      shortRoomURL: null,
      onBoard: false,
      copied: true,
      startShown: false,
      startBtnReveal: false,
      showModal: false
    };
  }

  componentWillMount () {
    this.setState({
      longRoomURL: inviteBaseURL + this.props.session.roomID
    });
  }
  componentDidMount () {
    // this.props.fetchBitlyLink(this.state.longRoomURL);
    mixpanel.track('Nav Invite');
  }

  RoundCountInc () {
    if (this.props.session.roundCount < 20) {
      this.props.roundInc();
    }
  }

  RoundCountDec () {
    console.log('INC INVITE');
    if (this.props.session.roundCount > 5) {
      this.props.roundDec();
    }
  }

  revealStartAction () {
    this.props.playSFX('tap');
    setTimeout(() => {
      this.setState({
        startShown: true,
        startBtnReveal: true
      });
    }, 8000);
  }

  hideShowModal () {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  popModal (type) {
    this.props.playSFX('tap');
    this.hideShowModal();
    this.revealStartAction();
  }
  onSuccess () {
    console.log('successfully coppied');
  }

  render () {
    const { session } = this.props;
    const encodedURL = `fb-messenger://share/?link=http%3A%2F%2Femojifaceoff.com%2Fchat%2F${this.props.session.roomID}`;
    const loaderUI = this.props.ui.loading
                            ? <div className='loader'><p>Sending Invitation</p></div>
                            : null;
    const clipboardData =
`${this.props.users.profile.displayName} is challenging you to an Emoji Faceoff.
Click here to Play: ${this.state.longRoomURL}`;

    const stopStart = this.state.startShown
                            ? <Link to={`/chat/${session.roomID}`} className='btn-login'>
                              <span>🎉 Start Game 🏁</span>
                            </Link>
                              : null;

    return (
      <div className='inner-container is-center invite-wrap'>
        <Header />
        <div className='round-select_wrap'>

          <div className='count-selector'>
            <h1># OF ROUNDS</h1>

            <CSSTransitionGroup
              component='span'
              className='count-digit'
              transitionName='count'
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}
              >
              <span key={this.props.session.roundCount} >{this.props.session.roundCount}</span>
            </CSSTransitionGroup>
            <div className='count-control'>
              <i className='ion-chevron-up' onClick={this.RoundCountInc.bind(this)} />
              <i className='ion-chevron-down' onClick={this.RoundCountDec.bind(this)} />
            </div>

          </div>
        </div>

        <a className='btn-fbshare' href={encodedURL} onClick={this.revealStartAction.bind(this)}>
          <img src={btnIcon} alt='' />Invite Facebook Friends
        </a>
        <h6 className='or-split'>OR</h6>
        <ClipboardButton component='a'
          className='btn-fbshare'
          data-clipboard-text={clipboardData}
          onClick={this.popModal.bind(this)}>
                Invite Friends via Invite Link
        </ClipboardButton>

        { this.state.startBtnReveal
                                      ? <Link to={`/chat/${session.roomID}`} className='btn-login' style={{marginTop: '2rem'}}>
                                        <span>🎉 Start Game 🏁</span>
                                      </Link>
                                       : null
        }

        <Modal modalOpen={this.state.showModal} toggleModal={this.hideShowModal.bind(this)}>

          <ul className='steps-list'>
            <h3 className='font-display'>Invite Copied to Clipboard!</h3>
            <img className='glyph-stop' src={stop_sign} alt='' />
            <h3>Getting the Party Started:</h3>
            <li><span>1</span> Open your messaging app.</li>
            <li><span>2</span> Send invite link to friends.</li>
            <li><span>3</span> Come back and Start Game!</li>
          </ul>
          {stopStart}

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
