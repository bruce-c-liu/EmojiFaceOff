import React, { Component } from 'react';

class Bubble  extends Component{
  render () {
    return (
      <div className="chat-bubble">
      		{this.props.deets}
      </div>
    )
  }
}
export default Bubble