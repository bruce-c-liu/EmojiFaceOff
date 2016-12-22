import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as actionCreators  from  '../actions/actionCreators.js';
import io from 'socket.io-client';
import Bubble from './Bubble';
// import iphone from '../../assets/iphone.png';
// console.log("IPHONE",iphone )
	
const socket = io('http://localhost:3001');

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
      		<div className="chat-head">
      			
      		</div>
      		<div className="chat-messages">
      			{chatList}
      		</div>
      		<form className="chat-form" onSubmit={this.sendMessage.bind(this)}>
      			<input type="text" value={this.state.message} onChange={this.handleChange.bind(this)} placeholder="Message"/>
      			<input type="submit" value="Submit"/>
      		</form>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    users: state.users,
    ui: state.ui
  }
}
function mapDispachToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
 export default connect(mapStateToProps,mapDispachToProps)(Chat);