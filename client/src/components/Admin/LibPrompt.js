import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators.js';
import axios from 'axios';
import PromptRow from './PromptRow';

class LibPrompt extends Component {
  constructor () {
    super();
    this.state = {
      rows: [],
      prompt: '',
      reqAnswer: '',
      authedId: '',
      submitRequest: false
    };
  }

  componentDidMount () {
    console.log(this.props.params);
    this.setState({
      authedId: this.props.users.authedId
    });
    axios.get(`/api/prompt/${this.props.params.promptID}`)
    .then(result => {
      console.log('Prompt details:', result.data);
      let storage = [];
      if (result.data) {
        result.data.Solutions.map((item) => {
          storage.push([
            item.id,
            item.approved ? 'ACTIVE' : 'PENDING',
            item.name
          ]);
          return item;
        });
        this.setState({
          rows: storage,
          prompt: result.data.prompt
        });
      }
    })
    .catch(err => {
      throw err;
    });
  }

  handleChangeAnswer (e) {
    this.setState({
      reqAnswer: e.target.value
    });
  }

  addAnswer (e) {
    e.preventDefault();
    console.log('Request sent to server', this.state);
    let tmpStorage = {};
    let answerOptions = this.state.reqAnswer
                        .split(';')
                        .filter(answer => {
                          if (answer.length > 0 && !tmpStorage[answer] && answer.codePointAt(0) > 0x03FF) {
                            tmpStorage[answer] = true;
                            return answer;
                          }
                        });
    if (answerOptions.length > 0) {
      console.log(`Sending to the server => prompt: ${this.state.prompt} ; answers: `, answerOptions);
      axios.post('/api/requestPrompt', {
        userFbId: this.state.authedId,
        prompt: this.state.prompt.toLowerCase(),
        answers: answerOptions
      })
      .then(result => {
        console.log('response from server', result.status);
        this.setState({
          reqAnswer: ''
        });
      })
      .catch(err => {
        throw err;
      });
    }
  }

  render () {
    const promptRows = this.state.rows.map((item, idx) => {
      return (
        <PromptRow deets={item} key={idx} />
      );
    });

    return (
      <div className='admin-container'>
        <p>Testing</p>
        <h3>Edit Changes for answers for {this.state.prompt}</h3>

        <table>
          <thead />
          <tbody>
            <tr>
              <th>id</th>
              <th>Status</th>
              <th>Orig Sol</th>
              <th>New Sol</th>
              <th>Edit</th>
              <th />
            </tr>
            {promptRows}
          </tbody>
        </table>
        <form onSubmit={this.addAnswer.bind(this)}>
          <h3>{`Add new answers for "${this.state.prompt}"`}</h3>
          <input className='reqAnswer'
            type='text' value={this.state.reqAnswer}
            onChange={this.handleChangeAnswer.bind(this)}
            placeholder='Answer to prompt: 😀' />
          <p />
          <input className='btn-input' type='submit' value='Submit' disabled={this.state.reqAnswer.length <= 0} />
        </form>
        <div>
          {this.state.submitRequest ? <h6>Your request has been submitted for approval!</h6> : null}
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
export default connect(mapStateToProps, mapDispachToProps)(LibPrompt);

