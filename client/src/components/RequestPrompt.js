import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import axios from 'axios';
import Header from './Header';
import mixpanel from 'mixpanel-browser';

class RequestPrompt extends Component {
  constructor () {
    super();
    this.state = {
      reqPrompt: '',
      reqAnswer: '',
      authedId: '',
      submitRequest: false
    };
  }

  componentDidMount () {
    this.setState({
      authedId: this.props.users.authedId
    });
    mixpanel.track('Nav Request');
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
    let tmpStorage = {};
    let answerOptions = this.state.reqAnswer
                        .split(';')
                        .filter(answer => {
                          if (answer.length > 0 && !tmpStorage[answer]) {
                            tmpStorage[answer] = true;
                            return answer;
                          }
                        });
    if (answerOptions.length > 0 && this.state.reqPrompt.length > 0) {
      mixpanel.track('Click Request Prompt');
      mixpanel.people.increment('Prompts Requested');
      this.setState({
        submitRequest: true
      });
      axios.post('/api/requestPrompt', {
        userFbId: this.state.authedId,
        prompt: this.state.reqPrompt.toLowerCase(),
        answers: answerOptions
      })
      .then(result => {
        this.setState({
          reqPrompt: '',
          reqAnswer: ''
        });
      })
      .catch(err => {
        throw err;
      });
    }
  }

  render () {
    return (
      <div className='inner-container is-center '>
        <Header />
        <div className='request-prompt_wrap'>
          <h1>Have any clever suggestions for prompts?</h1>
          <form className='contact-form' onSubmit={this.requestNewPrompt.bind(this)}>
            <h3>Send us your requests</h3>
            <h3>Get 200 coins on approval!</h3>
            <input className='input-txt'
              type='text' value={this.state.reqPrompt}
              onChange={this.handleChangePrompt.bind(this)}
              placeholder='Your prompt. Ex: happy' />
            <p />
            <input className='input-txt'
              type='text' value={this.state.reqAnswer}
              onChange={this.handleChangeAnswer.bind(this)}
              placeholder='Answer: 😀' />
            <p />
            <input className='input-submit' type='submit' value='Submit' disabled={this.state.reqPrompt.length <= 0} />
          </form>

          <div>
            {this.state.submitRequest ? <h6 className='success-msg'>Your request has been submitted for approval!</h6> : null}
          </div>
        </div>
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
export default connect(mapStateToProps, mapDispachToProps)(RequestPrompt);
