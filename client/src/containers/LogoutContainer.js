import React, { Component } from 'react';
import { connect } from 'react-redux';
import {logoutAndUnauth} from '../actions/actionCreators.js';
import mixpanel from 'mixpanel-browser';

class LogoutContainer extends Component {

  componentDidMount () {
    this.props.dispatch(logoutAndUnauth());
  }
  render () {
    mixpanel.track('Nav Logout');
    return (
      <div>
        <h1>LOGGED OUT</h1>

      </div>
    );
  }
}
export default connect()(LogoutContainer);
