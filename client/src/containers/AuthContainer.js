import React, { Component } from 'react';
import auth from '../helpers/auth.js';
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators  from  '../actions/actionCreators.js';
import { formatUserInfo } from '../helpers/utils';
import { firebaseAuth } from '../config/constants.js';





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
        //alert("HERE I AM")
      }
    } else {
       this.props.removeFetchingUser()
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
       
        <a href="fb-messenger://share/?link=https://emoji-faceoff.firebaseapp.com/&app_id=727951743985191">Send In Messenger</a>
       <a href="fb-messenger://share/?link=https%3A%2F%2Femoji-faceoff.firebaseapp.com%2F%26app_id%3D727951743985191">Encodedr</a>
    		<button className="btn-login" onClick={this.handleAuth.bind(this)}>
    			Start Play!
    		</button>
    </div>

    )
  }
}


function mapStateToProps(state) {
  return {
    users: state.users,
    ui: state.ui
  }
}
function mapDispachToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
 export default connect(mapStateToProps,mapDispachToProps)(AuthContainer);



// export default connect(
//   (state) => ({isFetching: state.isFetching, error: state.error}),
//   (dispatch) => bindActionCreators(actionCreators, dispatch)
// )(AuthContainer)