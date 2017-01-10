import React, { Component } from 'react';

class Contact  extends Component{
  render () {
    return (
     <div className='inner-container is-center'>
     	<h1> Contact Us</h1>
     	<form className="contact-form" action="">
     		<input className="input-txt" type="text" placeholder="Your Name"/>
     		<input className="input-txt" type="text" placeholder="Your Email Address"/>
     		<textarea name="" id="" cols="30" rows="10"></textarea>
     	</form>
     </div>
    )
  }
}
export default Contact