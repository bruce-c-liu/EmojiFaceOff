import React, { Component } from 'react';
// import auth from '../helpers/auth.js';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators.js';
// import { formatUserInfo } from '../helpers/utils';
// import { firebaseAuth } from '../config/constants.js';

class AuthContainer extends Component {

  handleAuth (e) {
    e.preventDefault();
    this.props.fetchAndHandleAuthedUser();
  }

  componentWillUpdate() {
      let nextPath;
      console.log('component will update AUTH', this.props.routing.locationBeforeTransitions.state);
      if (this.props.routing.locationBeforeTransitions.state) {
          nextPath = this.props.routing.locationBeforeTransitions.state.nextPathname;
      } else nextPath = '/login';

      if (this.checkLocalStorage()) {
          console.log("LOCAL STORAGE NOAUTH:", nextPath)
          if (nextPath === '/' || nextPath === '/login') this.props.history.push(`/mode`);
          //else this.props.history.push(`${nextPath}`);
          else {
              console.log("NAVIGATING TO NEXT PATH:", nextPath)
              browserHistory.push(`${nextPath}`);
          }
      }
  }


  checkLocalStorage () {
    for (let key in window.localStorage) {
      if (key.startsWith('firebase:authUser') && window.localStorage[key]) return true;
    }
    return false;
  }

  render () {
    return (
      <div className='login-wrap'>
        <h1 className='brand-title'>Emoji Faceoff</h1>
        {this.props.users.isAuthed ? <Link to='/mode'>YOU ARE LOGGED IN</Link> : null}

        <button className='btn-login' onClick={this.handleAuth.bind(this)}>
          Login With Facebook to Start!
        </button>
      </div>
    );
  }
}

export default connect(
  (state) => ({users: state.users, ui: state.ui, routing: state.routing}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(AuthContainer);
