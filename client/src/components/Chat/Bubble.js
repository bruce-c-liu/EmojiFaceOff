import React, { Component } from 'react';
import Interweave from 'interweave';
import {Motion, spring, presets} from 'react-motion';
import classNames from 'classnames';
import nerd from '../../assets/emoji_nerd.png';

class Bubble extends Component {
  render () {
    const bubbleClass = classNames({
      'chat-bubble': true,
      'on-left': this.props.deets.user === 'ebot'
    });
    const avatarProp = this.props.profile
                                    ? this.props.profile.info.avatar
                                    : null;
    const avatarSrc = this.props.deets.user === 'ebot' && this.props.profile
                                    ? nerd
                                    : avatarProp;
    const avatarBG = {
      backgroundImage: `url(${avatarSrc})`
    };
    return (
      <Motion defaultStyle={{x: 0}} style={{x: spring(1,  presets.stiff)}}>
        {value => <div className={bubbleClass} style={{transform: `scale(${value.x})` , opacity: value.x}}>
          <Interweave
            tagName='span'
            content={this.props.deets.text}
          />
            <div className='bubble-name' style={avatarBG} />
        </div>
      }
      
        </Motion>

    );
  }
}
export default Bubble;
