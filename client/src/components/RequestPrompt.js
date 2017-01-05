import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import axios from 'axios';
import Header from './Header';

class RequestPrompt extends Component {
  constructor () {
    super();
    this.state = {
      reqPrompt: '',
      reqAnswer: '',
      authedId: ''
    };
  }

  componentDidMount () {
    this.setState({
      authedId: this.props.users.authedId
    });
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
    console.log('Request sent to server', this.state);
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
      console.log(`Sending to the server => prompt: ${this.state.reqPrompt} ; answers: `, answerOptions);
      axios.post('/api/requestPrompt', {
        userFbId: this.state.authedId,
        prompt: this.state.reqPrompt.toLowerCase(),
        answers: answerOptions
      })
      .then(result => {
        console.log('response from server', result.status);
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
