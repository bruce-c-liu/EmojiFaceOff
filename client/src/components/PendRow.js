import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import axios from 'axios';

class PendRow extends Component {
  constructor () {
    super();
    this.state = {
      idx: '',
      avatar: '',
      prompt: '',
      answers: [],
      levelSelect: 1,
      promptId: null,
      approved: false
    };
  }

  componentWillMount () {
    this.setState({
      idx: this.props.key,
      avatar: this.props.deets[0],
      prompt: this.props.deets[1],
      answers: this.props.deets[2],
      promptId: this.props.deets[3]
    });
  }

  approveRequest (e) {
    e.preventDefault();
    axios.put('/api/pendPrompts', {
      promptId: this.state.promptId,
      promptLevel: this.state.levelSelect,
      answers: this.state.answers
    })
    .then(result => {
      console.log('from server', result);
      if (result) {
        this.setState({
          approved: true
        });
      }
    })
    .catch(err => {
      throw err;
    });
  }

  handleSelect (e) {
    e.preventDefault();
    this.setState({
      levelSelect: e.target.value
    });
  }

  render () {
    const avatarStyle = {
      maxHeight: '20px',
      maxWidth: '20px'
    };
    const displayNone = {
      display: 'none'
    };
    return (
      <tr style={this.state.approved ? displayNone : null}>
        <td>
          <img style={avatarStyle} src={this.state.avatar} />
        </td>
        <td>{this.state.prompt}</td>
        <td>{this.state.answers}</td>
        <td>
          <select onChange={this.handleSelect.bind(this)}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
          </select>
        </td>
        <td>
          <button onClick={this.approveRequest.bind(this)}>Approve!</button>
        </td>
      </tr>
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
export default connect(mapStateToProps, mapDispachToProps)(PendRow);

