import React, { Component } from 'react';

class ChatHeadPractice extends Component {
  render () {
    // const {deets, startProp} = this.props;
    return (
      <div className='chat-head_inner'>
        {
            this.props.hostStatus ? <button className='btn-start' onClick={(e) => this.props.startProp(e)}>START</button>
                          : <p>Waiting for host to begin the game.</p>
        }
        <p> Practice Mode</p>
      </div>
    );
  }
}
export default ChatHeadPractice;
