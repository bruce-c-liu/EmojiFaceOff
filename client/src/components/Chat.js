import React, { Component } from 'react';
import io from 'socket.io-client';
import Bubble from './Bubble';
// import iphone from '../../assets/iphone.png';
// console.log("IPHONE",iphone )
	
const socket = io('http://localhost:3000');

class Chat  extends Component{
constructor(){
	super()
	this.state = {
		message: '',
		user: '',
		chats: []
	}
	socket.on('message', (message) => {
		this.setState({chats: [...this.state.chats, message] })									
	})
}
componentDidMount(){

}
handleNameChange(e){
	this.setState({
		user: e.target.value
	})
}
handleChange(e){
	this.setState({
		message: e.target.value
	})
}
sendMessage(e){
	e.preventDefault();
	const userMessage = { user: this.state.user, text: this.state.message }
	socket.emit('message',  userMessage)
	this.setState({
		chats: [...this.state.chats, userMessage],
		message: '',
		user: ''
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
      		<form onSubmit={this.sendMessage.bind(this)}>
      			<input type="text" value={this.state.user} onChange={this.handleNameChange.bind(this)} placeholder="Name"/>
      			<input type="text" value={this.state.message} onChange={this.handleChange.bind(this)} placeholder="Message"/>
      			<input type="submit" value="Submit"/>
      		</form>
      </div>
    )
  }
}
export default Chat