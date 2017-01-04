import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';

class OnBoard extends Component {
  enterGame (e) {
    e.preventDefault();
    browserHistory.push(`/chat/${this.props.roomLink}`);
  }

  render () {
    const onBoardClass = classNames({
      'onboard-wrap': true,
      'is-visible': this.props.show
    });

    return (
      <div className={onBoardClass}>
        <h1 className='jumbo'><span>😎</span>Sweet!</h1>
        <p>Invites went out for your friends to join the challenge. While you wait for them to arrive,  warm-up those skills in practice mode.</p> <p> Once 1 other player has entered, you may offically start the game by tapping the "START" button.</p>
        <button className='btn-outline' onClick={this.enterGame.bind(this)}>Let's Get This Party Started! 🎉></button>
      </div>
    );
  }
}

export default OnBoard;
