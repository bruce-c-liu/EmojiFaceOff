import React, { Component } from 'react';

class ChatHeadPractice extends Component {

  render () {
    const roomStatusMsg = (this.props.roomType === 'RANKED')
                        ? 'Searching for a Suitable Opponent'
                        : 'Waiting for the Host to Begin the Game';

    return (

      <div className='chat-head_inner'>
        {
          this.props.hostStatus ? <button className='btn-start' onClick={(e) => this.props.startProp(e)}>START</button>
                                : <p>{roomStatusMsg}</p>

        }
      </div>
    );
  }
}
export default ChatHeadPractice;
