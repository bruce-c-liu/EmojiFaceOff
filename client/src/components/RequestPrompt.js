import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import axios from 'axios';

class RequestPrompt extends Component {
  constructor () {
    super();
    this.state = {
      reqPrompt: '',
      reqAnswer: '',
      user: ''
    };
  }

  componentWillMount () {
    // console.log(this.props);
  }

  handleChangePrompt (e) {
    this.setState({
      reqPrompt: e.target.value
    });
  }

  handleChangeAnswer (e) {
    this.setState({
      reqAnswer: e.target.value
    });
  }

  requestNewPrompt (e) {
    e.preventDefault();
    console.log(this.state);
    /**
     * USER NEEDS TO BE CHANGED
     */
    axios.post('/api/requestPrompt', {
      user: this.state.user,
      prompt: this.state.reqPrompt,
      answer: this.state.reqAnswer
    })
    .catch(err => {
      throw err;
    });
  }

  render () {
    return (
      <form className='RequestPrompt-form' onSubmit={this.requestNewPrompt.bind(this)}>
        <input className='reqPrompt'
          type='text' value={this.state.reqPrompt}
          onChange={this.handleChangePrompt.bind(this)}
          placeholder='Your custom prompt' />
        <input className='reqAnswer'
          type='text' value={this.state.reqAnswer}
          onChange={this.handleChangeAnswer.bind(this)}
          placeholder='Answer to prompt' />
        <input className='btn-input' type='submit' value='Submit' disabled={this.state.reqPrompt.length <= 0} />
      </form>
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
export default connect(mapStateToProps, mapDispachToProps)(RequestPrompt);
