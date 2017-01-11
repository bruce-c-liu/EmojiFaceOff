import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';

class Contact extends Component {

  handleSubmit (e) {
    e.preventDefault();
    const formData = {
      name: ReactDOM.findDOMNode(this.refs.name).value,
      email: ReactDOM.findDOMNode(this.refs.email).value,
      message: ReactDOM.findDOMNode(this.refs.message).value
    };
    console.log('FORM DATA', formData);
  }
  render () {
    return (
      <div className='inner-container is-center'>
        <Header />
        <h1> Contact Us</h1>
        <form className='contact-form' action='' onSubmit={this.handleSubmit.bind(this)}>
          <input className='input-txt' ref='name' type='text' placeholder='Your Name' />
          <input className='input-txt' ref='email' type='text' placeholder='Your Email Address' />
          <textarea className='input-area' ref='message' rows='8' placeholder='Your Message' />
          <input className='input-submit' type='submit' value='Submit' />
        </form>
      </div>
    );
  }
}
export default Contact;
