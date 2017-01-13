import React, { Component } from 'react';
import Interweave from 'interweave';
import classNames from 'classnames';
import nerd from '../../assets/emoji_nerd.png';
import axios from 'axios';

class Bubble extends Component {
  // constructor (props) {
  //   super(props);
  // }

  requestAsSolution (e) {
    e.preventDefault();
    axios.post('/api/requestPrompt', {
      userFbId: this.props.profile.auth,
      prompt: this.props.deets.prompt,
      answers: [this.props.deets.text]
    });
  }

  render () {
    const deets = this.props.deets;

    const bubbleClass = classNames({
      'chat-bubble': true,
      'on-left': deets.user === 'ebot',
      'on-left is-correct': deets.type === 'correctGuess',
      'is-wrong': deets.type === 'incorrectGuess'
    });

    const avatarSrc = deets.user === 'ebot'
                                    ? nerd
                                    : deets.imgUrl;
    const avatarBG = {
      backgroundImage: `url(${avatarSrc})`
    };

    let gif = deets.gifUrl ? (<img src={deets.gifUrl} />) : '';

    const bubble = deets.type === 'incorrectGuess'
                    ? (<a href='#' onClick={this.requestAsSolution.bind(this)}>
                      <Interweave
                        tagName='span'
                        content={deets.text}
                      />
                      {gif}
                    </a>)
                    : (<div>
                      <Interweave
                        tagName='span'
                        content={deets.text}
                      />
                      {gif}
                    </div>
                    );

    return (

      <div className={bubbleClass} >
        {bubble}
        <div className='bubble-name' style={avatarBG} />
      </div>
    );
  }
}
export default Bubble;
