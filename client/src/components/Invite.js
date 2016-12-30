import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as actionCreators  from  '../actions/actionCreators.js';
import {inviteBaseURL} from '../helpers/utils.js'
import { SMSInvite } from '../helpers/http.js';
import btnIcon  from '../assets/Messenger_Icon.png';

class Invite  extends Component{
constructor(){
	super()
	this.state = {
		inviteCount: 1,
            inviteURL: null
	}
}
componentDidMount(){
 // this.props.fetchRoomId();
   this.setState({
    inviteURL: inviteBaseURL + this.props.session.roomID
   })
}	

InviteCountInc(){
  if(this.props.session.inviteCount < 6){
	this.props.counterInc();
      this.props.playSFX('tick');
  }
}
InviteCountDec(){
	console.log("INC INVITE" )	
	if(this.props.session.inviteCount >= 2){
		this.props.counterDec()	
            this.props.playSFX('tick');
	}	
}
inviteBySms(e){
  e.preventDefault();
  let userName = this.props.users.profile.info.name;
  let roomUrl = this.state.inviteURL;
  let numbers = ReactDOM.findDOMNode(this.refs.toSMS).value
  SMSInvite(userName, roomUrl, numbers)

}

  render () {
   const encodedURL = `fb-messenger://share/?link=http%3A%2F%2Femojifaceoff.herokuapp.com%2Fchat%2F${ this.props.session.roomID}`
    return (
      <div className="inner-container is-center invite-wrap">
      		<p> How many friends would you like to invite in this game?</p>
      		<div className="count-selector">	
      			<i className="ion-chevron-down" onClick={this.InviteCountDec.bind(this)} ></i> 
      			<CSSTransitionGroup
      			  component="span"
      			  className="count-digit"
      			  transitionName="count"
      			  transitionEnterTimeout={250}
      			  transitionLeaveTimeout={250}
      			>
      				<span key={this.props.session.inviteCount} >{this.props.session.inviteCount}</span>
      			</CSSTransitionGroup>
      			<i className="ion-chevron-up" onClick={this.InviteCountInc.bind(this)}></i>    						
      		</div>

      		<form className="form-sms" onSubmit={this.inviteBySms.bind(this)} >
      			<div className="input-inline">
      				<i className="ion-android-call"></i>
      				<input type="tel"  ref="toSMS" placeholder="Invite by text message"/>
      				<button className="btn-input">Send</button>
      			</div>
      		</form>
            <h6 className="or-split">OR</h6>

          <a className="btn-fbshare" href={encodedURL}>
            <img src={btnIcon} alt=""/>INVITE FACEBOOK FRIENDS
          </a>
     


      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    users: state.users,
    ui: state.ui,
    session: state.session
  }
}
function mapDispachToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
 export default connect(mapStateToProps,mapDispachToProps)(Invite);