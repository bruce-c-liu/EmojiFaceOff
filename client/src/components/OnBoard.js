import React, { Component } from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';

class OnBoard extends Component {
  render () {
    const onBoardClass = classNames({
      'onboard-wrap': true,
      'is-visible': this.props.show
    })
    return (
      <div className={onBoardClass}>
        <h1 className='jumbo'><span>😎</span>Sweet!</h1>
        <p>Invites went out for your friends to join the challenge. While you wait for them to arrive,  warm-up those skills in practice mode.</p> <p> Once 1 other player has entered, you may offically start the game by tapping the "START" button.</p>
        <Link to={`/chat/${this.props.roomLink} `}className='btn-outline'>Let's Get This Party Started! 🎉</Link>
      </div>
    );
  }
}

export default OnBoard;
