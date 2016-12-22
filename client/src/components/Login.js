import React, { Component } from 'react';

class Login  extends Component{

handleLoginClick(e){
	this.props.handleAuth(e);
}	
  render () {
    return (
      <div className="login-wrap">
      		<h1 className="brand-title">Emoji Faceoff</h1>
         
      		<button className="btn-login" onClick={this.handleLoginClick.bind(this)}>
      			Start Play!
      		</button>
      </div>
    )
  }
}
export default Login

