import React, { Component } from 'react';
import main  from '../styles/main.css';
import auth from '../helpers/auth.js';
import { bindActionCreators } from 'redux';
import * as actionCreators  from  '../actions/actionCreators.js';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { formatUserInfo } from '../helpers/utils';
import { firebaseAuth } from '../config/constants.js'

class App extends Component {

  

  render() {
  	let children = null;
  	if (this.props.children) {
  	  children = React.cloneElement(this.props.children, {
  	    auth: this.props.route.auth //sends auth instance from route to children
  	  })
  	}
    return (
      <div className="wrap">
      		{children}
      </div>
    );
  }
}

export default connect(
  (state) => ({isAuthed: state.isAuthed, isFetching: state.isFetching}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(App)
