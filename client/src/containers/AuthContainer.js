import React, { Component } from 'react';
// import auth from '../helpers/auth.js';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators.js';
// import { formatUserInfo } from '../helpers/utils';
// import { firebaseAuth } from '../config/constants.js';
import { browserHistory } from 'react-router';
class AuthContainer extends Component {

  handleAuth (e) {
    const nextPath = this.props.routing.locationBeforeTransitions.state.nextPathname;
    e.preventDefault();
    this.props.fetchAndHandleAuthedUser(nextPath);
  }

  componentDidMount () {
    const nextPath = this.props.routing.locationBeforeTransitions.state.nextPathname;
    if (nextPath && this.checkLocalStorage()) {
      browserHistory.push(`${nextPath}`);
    }
  }

  checkLocalStorage () {
    for (let key in window.localStorage) {
      if (key.startsWith('firebase:authUser') && window.localStorage[key]) {
        return true;
      }
      return false;
    }
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
  (state) => ({users: state.users, ui: state.ui, routing: state.routing}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(AuthContainer);
