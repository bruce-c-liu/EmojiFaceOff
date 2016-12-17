import React, { Component } from 'react';

class Bubble  extends Component{
  render () {
    return (
      <div className="chat-bubble">
      		{this.props.deets.text}
      		<div className="bubble-name">
      			{this.props.deets.user}
      		</div>
      </div>
    )
  }
}
export default Bubble