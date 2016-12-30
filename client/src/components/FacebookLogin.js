import React, { Component } from 'react';

class FacebookLogin extends Component {
  render () {
    return (
      <button onClick={this.props.onAuth} className='btn'>
        {this.props.isFetching === true
          ? 'Loading'
          : 'Login with facebook'}
      </button>
    );
  }
}
export default FacebookLogin;
