import React, { Component } from 'react';
import auth from '../helpers/auth.js';
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators  from  '../actions/actionCreators.js';
import { formatUserInfo } from '../helpers/utils';
import { firebaseAuth } from '../config/constants.js';
import { Link} from 'react-router';


class AuthContainer  extends Component{

componentDidMount () {
  firebaseAuth().onAuthStateChanged((user) => {
    if (user) {
      console.log("LOGGED IN", user )
      console.log("PATH NAME", this.props.location.pathname )
      const userData = user.providerData[0]
      const userInfo = formatUserInfo(userData.displayName, userData.photoURL, user.uid)
      this.props.authUser(user.uid)
      this.props.fetchingUserSuccess(user.uid, userInfo, Date.now())
      if (this.props.route.path === '/login') {
        browserHistory.push('/mode')
      }
    } else {
       this.props.removeFetchingUser()
       console.log("NOT LOGGED IN" )
    }
  })
}	

handleAuth (e) {
  e.preventDefault()
  this.props.fetchAndHandleAuthedUser()
   .then(() => browserHistory.push('/mode'))
}

 render () {


    return (
    <div className="login-wrap">
    		<h1 className="brand-title">Emoji Faceoff</h1> 
            <Link to="/mode">Choose Mode</Link>
    		<button className="btn-login" onClick={this.handleAuth.bind(this)}>
    			Login
    		</button>
    </div>

    )
  }
}


export default connect(
  (state) => ({users: state.users, ui: state.ui}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(AuthContainer)