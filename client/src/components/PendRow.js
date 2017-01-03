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
      answers: []
    };
  }

  componentDidMount () {
    this.setState({
      idx: this.props.key,
      avatar: this.props.deets[0],
      prompt: this.props.deets[1],
      answers: this.props.deets[2]
    });
  }

  handleClick (e) {
    e.preventDefault();
    console.log('was clicked', e.target, this.state);
  }

  render () {
    return (
      <tr>
        <td>
          <img src={this.state.avatar} />
        </td>
        <td>{this.state.prompt}</td>
        <td>{this.state.answers}</td>
        <td>
          <button onClick={this.handleClick.bind(this)}>Click me </button>
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

