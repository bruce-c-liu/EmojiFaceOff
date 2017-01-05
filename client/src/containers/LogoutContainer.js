import React, { Component } from 'react';
import { connect } from 'react-redux'
import {logoutAndUnauth} from '../actions/actionCreators.js';

class LogoutContainer  extends Component{

componentDidMount () {
	this.props.dispatch(logoutAndUnauth())
}	
  render () {
    return (
      <div>
      		<h1>LOGGED OUT</h1>
      	
      </div>
    )
  }
}
export default connect()(LogoutContainer)