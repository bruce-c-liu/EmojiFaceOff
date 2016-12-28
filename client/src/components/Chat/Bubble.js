import React, { Component } from 'react';
import Interweave from 'interweave';
import {Motion, spring} from 'react-motion';
import classNames from 'classnames';
import nerd from '../../assets/emoji_nerd.png';

class Bubble  extends Component{
  render () {
  	const bubbleClass = classNames({
  		'chat-bubble': true,
  		'on-left': this.props.deets.user === 'ebot'
  	})
    const avatarProp =  this.props.profile 
                                    ? this.props.profile.info.avatar
                                    : null; 
    const avatarSrc = this.props.deets.user === 'ebot'  && this.props.profile
                                    ? nerd
                                    : avatarProp;
    const avatarBG = {
      backgroundImage:  `url(${avatarSrc})`
    }
    return (
      <div className={bubbleClass}>
    		{/* {this.props.deets.text} */}
      		
      		<Interweave
      		  tagName="span"
      		  content={this.props.deets.text}
      		/>
      		<div className="bubble-name" style={avatarBG}>

      		</div>
      </div>
    )
  }
}
export default Bubble