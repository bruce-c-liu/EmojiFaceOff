import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import ReactDOM from 'react-dom';
import Header from './Header';
import dot_loader from '../assets/loader_three_dots.svg';

class Contact extends Component {

  handleSubmit (e) {
    e.preventDefault();
    const formData = {
      name: ReactDOM.findDOMNode(this.refs.name).value,
      email: ReactDOM.findDOMNode(this.refs.email).value,
      message: ReactDOM.findDOMNode(this.refs.message).value
    };
    this.props.sendContactForm(formData)
    console.log('FORM DATA', formData);
  }
  render () {
    const { ui } = this.props;
    const btnLabel = ui.formSending
                                  ? <img src={dot_loader}/>
                                  : 'Submit'
    return (
      <div className='inner-container is-center'>
        <Header />
        <h1> Contact Us</h1>
        <form className='contact-form' action='' onSubmit={this.handleSubmit.bind(this)}>
          <input className='input-txt' ref='name' type='text' placeholder='Your Name' />
          <input className='input-txt' ref='email' type='text' placeholder='Your Email Address' />
          <textarea className='input-area' ref='message' rows='8' placeholder='Your Message' />
          <button className='input-submit'  onClick={this.handleSubmit.bind(this)}>
            {btnLabel}
          </button>
        </form>
      </div>
    );
  }
}
function mapStateToProps (state) {
  return {
    users: state.users,
    ui: state.ui,
    session: state.session
  };
}
function mapDispachToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispachToProps)(Contact);
