import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {Motion, spring, presets} from 'react-motion';
// import Hint from './Hint';

class ChatHead extends Component {
  render () {
    const {deets, coinBal} = this.props;

    return (
      <div className='chat-head_active' >
          <div className='flip-stat'>
                    <CSSTransitionGroup
                      transitionName='count'
                      transitionEnterTimeout={250}
                      transitionLeaveTimeout={250}
                      >
                      <span key={deets.round} >{deets.round}</span>
                    </CSSTransitionGroup>
                    <p> ROUND</p>
          </div>
          <div className='flip-stat'>
                  <CSSTransitionGroup
                    transitionName='count'
                    transitionEnterTimeout={250}
                    transitionLeaveTimeout={250}
                    >
                    <span key={deets.score} >{deets.score}</span>
                  </CSSTransitionGroup>
                  <p> SCORE</p>
              </div>
              <div className='flip-stat coin-stat'>

            <Motion defaultStyle={{x: 0}} style={{x: spring(coinBal)}}>
              {value => <span>{Math.round(value.x)}</span>}
            </Motion>


                  <p> COINS</p>
              </div>
      </div>
    );
  }
}
export default ChatHead;
