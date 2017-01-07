import React, { Component } from 'react';

class ChatHeadPractice extends Component {

  render () {
    let element;
    if (this.props.hostStatus) {
      element = <button className='btn-start' onClick={(e) => this.props.startProp(e)}>START</button>;
    } else {
      if (this.props.roomType === 'RANKED'){
        element = <p>Searching for a Suitable Opponent<p>
      } else {
        element = <p>Waiting for the Host to Begin the Game<p>
      }
    }

    return (
      <div className='chat-head_inner'>
        {
          element
        }
      </div>
    );
  }
}
export default ChatHeadPractice;
