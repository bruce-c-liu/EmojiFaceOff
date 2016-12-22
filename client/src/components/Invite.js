import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as actionCreators  from  '../actions/actionCreators.js';

class Invite  extends Component{
constructor(){
	super()
	this.state = {
		inviteCount: 1
	}
}	

InviteCountInc(){
		
	this.props.counterInc()
}
InviteCountDec(){
	console.log("INC INVITE" )	
	if(this.props.session.inviteCount >= 2){
		this.props.counterDec()	
	}	
}

  render () {
    return (
      <div className="inner-container is-center">
      		<p> How many friends would you like to invite?</p>
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
      		<form className="form-sms" >
      			<div className="input-inline">
      				<i className="ion-android-call"></i>
      				<input type="phone"/>
      				<button className="btn-input">Send</button>
      			</div>
      		</form>

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