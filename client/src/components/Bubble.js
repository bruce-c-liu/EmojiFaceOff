import React, { Component } from 'react';
import Interweave from 'interweave';
import classNames from 'classnames';

class Bubble  extends Component{
  render () {
  	const bubbleClass = classNames({
  		'chat-bubble': true,
  		'on-left': this.props.deets.user === 'ebot'
  	})
    return (
      <div className={bubbleClass}>
    		{/* {this.props.deets.text} */}
      		
      		<Interweave
      		  tagName="span"
      		  content={this.props.deets.text}
      		/>
      		<div className="bubble-name">
      			{this.props.deets.user}
      		</div>
      </div>
    )
  }
}
export default Bubble