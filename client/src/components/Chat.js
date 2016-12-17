import React, { Component } from 'react';
import io from 'socket.io-client';
import Bubble from './Bubble';

//const socket = io();

class Chat  extends Component{
constructor(){
	super()
	this.state = {
		msg: '',
		name: '',
		chats: ["ONE", "TWO", "THREE"]
	}
}
handleNameChange(e){
	this.setState({
		name: e.target.value
	})
}
handleChange(e){
	this.setState({
		msg: e.target.value
	})
}
handleSubmit(e){
	e.preventDefault();
	this.setState({
		chats: [...this.state.chats, this.state.msg],
		msg: '',
		name: ''
	})
}	
  render () {
  	const chatList = this.state.chats.map( (item, i)=>{
  		return <Bubble deets={item} key={i}/>
  	})
  	const roomID = this.props.params.roomID
  	console.log(roomID )
  		

    return (
      <div className="chat-view">
      		<h3>ROOM ID / SOCKET ROOM ID:  { roomID }</h3>
      		<div className="chat-messages">
      			{chatList}
      		</div>
      		<form onSubmit={this.handleSubmit.bind(this)}>
      			<input type="text" value={this.state.name} onChange={this.handleNameChange.bind(this)} placeholder="Name"/>
      			<input type="text" value={this.state.msg} onChange={this.handleChange.bind(this)} placeholder="Message"/>
      			<input type="submit" value="Submit"/>
      		</form>
      </div>
    )
  }
}
export default Chat