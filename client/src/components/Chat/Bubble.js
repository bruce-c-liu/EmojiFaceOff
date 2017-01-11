import React, { Component } from 'react';
import Interweave from 'interweave';
import {Motion, spring, presets} from 'react-motion';
import classNames from 'classnames';
import nerd from '../../assets/emoji_nerd.png';

class Bubble extends Component {
  render () {
    const bubbleClass = classNames({
      'chat-bubble': true,
      'on-left': this.props.deets.user === 'ebot',
      'on-left is-correct': this.props.deets.type === 'correctGuess',
      'is-wrong': this.props.deets.type === 'incorrectGuess'
    });

    const avatarSrc = this.props.deets.user === 'ebot'
                                    ? nerd
                                    : this.props.deets.imgUrl;
    const avatarBG = {
      backgroundImage: `url(${avatarSrc})`
    };
    return (

      <div className={bubbleClass} >
          <Interweave
            tagName='span'
            content={this.props.deets.text}
          />
          <div className='bubble-name' style={avatarBG} />
        </div>

    );
  }
}
export default Bubble;
