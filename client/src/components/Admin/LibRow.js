import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators.js';

class LibRow extends Component {
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
    browserHistory.push(`/admin/libprompt/${this.state.promptId}`);
    console.log('button clicked');
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
          <img style={avatarStyle} alt='Smiley Face' src={this.state.avatar} />
        </td>
        <td>{this.state.prompt}</td>
        <td>{this.state.answers}</td>
        <td>
          <div>
            <button onClick={this.approveRequest.bind(this)}>Details</button>
          </div>
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
export default connect(mapStateToProps, mapDispachToProps)(LibRow);

