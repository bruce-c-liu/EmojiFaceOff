import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import onboardBG from '../../assets/onboard.jpg'

class OnBoard extends Component {

  render () {
    const onBoardClass = classNames({
      'onboard-wrap': true,
      'is-visible': this.props.show
    });

    return (
      <div className="onboard-wrap" style={{backgroundImage: `url(${onboardBG})` }}>
            
      </div>
    );
  }
}

export default OnBoard;
