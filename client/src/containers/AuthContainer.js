import React, { Component } from 'react';
// import auth from '../helpers/auth.js';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators.js';
import firebase from 'firebase';
import { firebaseAuth } from '../config/constants.js';

class AuthContainer extends Component {

  handleAuth (e) {
    e.preventDefault();
    // this.props.fetchAndHandleAuthedUser();
    if (this.props.routing.locationBeforeTransitions.state) {
      let nextPath = this.props.routing.locationBeforeTransitions.state.nextPathname;
      window.localStorage.setItem('nextPath', nextPath);
    }
    firebaseAuth().signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  }

  componentWillUpdate () {
    let nextPath;
    if (window.localStorage.nextPath) {
      // nextPath = this.props.routing.locationBeforeTransitions.state.nextPathname;
      nextPath = window.localStorage.nextPath;
      window.localStorage.removeItem('nextPath');
    } else nextPath = '/login';

    if (this.checkLocalStorage()) {
      firebaseAuth().getRedirectResult()
      .then(result => {
        if (result.user) {
          console.log('firebase redirect result auth cotainer', result);
          let user = {
            name: result.user.displayName,
            uid: result.user.uid,
            avatar: result.user.photoURL
          };
          this.props.postUserData(user);
        } else {
          console.log('NOOOOOOOOOOOO auth from firebase redirect');
        }
      });

      console.log('LOCAL STORAGE NOAUTH:', nextPath);
      if (nextPath === '/' || nextPath === '/login' || nextPath === null) this.props.history.push(`/mode`);
      else {
        console.log('NAVIGATING TO NEXT PATH:', nextPath);
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
