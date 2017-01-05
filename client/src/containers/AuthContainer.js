import React, { Component } from 'react';
import auth from '../helpers/auth.js';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators.js';
import { formatUserInfo } from '../helpers/utils';
import { firebaseAuth } from '../config/constants.js';

class AuthContainer extends Component {

  handleAuth (e) {
    e.preventDefault();
    this.props.fetchAndHandleAuthedUser()
  }

  render () {
    return (
      <div className='login-wrap'>
        <h1 className='brand-title'>Emoji Faceoff</h1>
        {this.props.users.isAuthed ? <Link to='/mode'>YOU ARE LOGGED IN</Link> : null}

        <button className='btn-login' onClick={this.handleAuth.bind(this)}>
          Login
        </button>
      </div>
    );
  }
}

export default connect(
  (state) => ({users: state.users, ui: state.ui}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(AuthContainer);
