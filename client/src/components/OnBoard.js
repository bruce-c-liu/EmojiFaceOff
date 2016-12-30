import React, { Component } from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as actionCreators  from  '../actions/actionCreators.js';


class OnBoard  extends Component{
  render () {
    return (
      <div className="inner-container  onboard-wrap">
      		<h1 className="jumbo"><span>😎</span>Sweet!</h1>
      		<p>Invites went out for your friends to join the challenge. While you wait for them to arrive,  warm-up those skills in practive mode.</p> <p> Once 1 other player has entered, you may offically start the game by tapping the "START" button.</p>
      		<Link to={`/chat/${this.props.roomID}`} className="btn-outline">Let's Get This Party Started! 🎉</Link>
      </div>
    )
  }
}

export default connect(
  ({session}) => ({roomID: session.roomID}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(OnBoard)