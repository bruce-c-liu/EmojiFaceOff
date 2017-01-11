import React, { Component } from 'react';
import {Link } from 'react-router';
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
      <div className="inner-container is-center">
        <h1 className='brand-title'>Emoji Faceoff</h1>
        <h1>You have been logged out</h1>
        <Link to={`/mode`} className='btn-login' style={{marginTop: '2rem'}}>
                    Log Back In 
         </Link>

      </div>
    );
  }
}
export default connect()(LogoutContainer);
