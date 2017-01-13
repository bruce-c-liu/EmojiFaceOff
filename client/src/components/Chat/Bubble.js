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

    const bubble = this.props.deets.type === 'incorrectGuess'
                    ? (<a href='#' onClick={this.requestAsSolution.bind(this)}>
                      <Interweave
                        tagName='span'
                        content={this.props.deets.text}
                      />
                    </a>)
                    : (<div>
                      <Interweave
                        tagName='span'
                        content={this.props.deets.text}
                      />
                      <img src='http://s2.quickmeme.com/img/4b/4b30399fd87f9d9c6d34f6b0884ee41bf6822148b09fc40144dd1ad6c00051e0.jpg' />
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
