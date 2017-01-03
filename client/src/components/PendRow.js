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
      levelSelect: 1
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
    return (
      <tr>
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

