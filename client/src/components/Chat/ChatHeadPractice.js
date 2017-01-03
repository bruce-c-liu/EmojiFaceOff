import React, { Component } from 'react'

class ChatHeadPractice  extends Component{
  render () {
  	const {deets, startProp} = this.props
    return (
      <div className="chat-head_inner"> 
      		{
      			this.props.hostStatus ? <button className='btn-start'  onClick={(e)=>this.props.startProp(e)}>START FACEOFF</button>
      									  : <p>DUDE NEEDS TO START GAME</p>	
      		}     	
      		
      		<p> Practice Mode</p>
      </div>
    )
  }
}
export default ChatHeadPractice