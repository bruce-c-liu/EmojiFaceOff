import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Hint from './Hint';


class ChatHead  extends Component{
  render () {
  	const {deets} = this.props;
  	
  	const hints =deets.solution.map ( (item, idx) =>{
  		return <Hint key={idx} hint={item} />
  	})
    return (
     <div className='chat-head_active' >
       

       <div className='flip-stat'>
         <p> ROUND</p>
         <CSSTransitionGroup
           transitionName='count'
           transitionEnterTimeout={250}
           transitionLeaveTimeout={250}
           >
           <span key={deets.round} >{deets.round}</span>
         </CSSTransitionGroup>
       </div>
       <div className="hint-wrap">
       	{hints}
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

     </div>
    )
  }
}
export default ChatHead