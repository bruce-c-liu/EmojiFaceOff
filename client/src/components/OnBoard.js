import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as actionCreators  from  '../actions/actionCreators.js';


class OnBoard  extends Component{
  render () {
    return (
      <div className="inner-container is-center onboard-wrap">
      		<h1 className="jumbo">Sweet!</h1>
      		<p>Invites went out to your friends to join the challenge. While you wait for them to arrive, you may warm-up those skills in practive mode.</p> <p> Once 1 other player has joined the challenge, you may offically start the game by tapping the "START" button.</p>
      </div>
    )
  }
}

export default connect(
  ({users}) => ({isAuthed: users.isAuthed, isFetching: users.isFetching}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(OnBoard)