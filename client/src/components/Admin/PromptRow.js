import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators.js';

class PromptRow extends Component {
  constructor () {
    super();
    this.state = {
      idx: '',
      id: '',
      approved: '',
      origSolution: '',
      newSolution: ''
    };
  }

  componentWillMount () {
    this.setState({
      idx: this.props.key,
      id: this.props.deets[0],
      approved: this.props.deets[1].toString(),
      origSolution: this.props.deets[2],
      newSolution: this.props.deets[2]
    });
  }

  approveRequest (e) {
    e.preventDefault();
    console.log('Edit button clicked');
  }

  handleSelect (e) {
    e.preventDefault();
    this.setState({
      levelSelect: e.target.value
    });
  }

  updatePrompt (e) {
    e.preventDefault();
    console.log('updating prompt', this.state);
  }

  handleEdit (e) {
    e.preventDefault();
    this.setState({
      newSolution: e.target.value
    });
  }
  render () {
    return (
      <tr>
        <td>{this.state.id}</td>
        <td>{this.state.approved}</td>
        <td>{this.state.origSolution}</td>
        <td>{this.state.newSolution}</td>
        <td>
          <form onSubmit={this.updatePrompt.bind(this)}>
            <input
              type='text' value={this.state.newSolution}
              onChange={this.handleEdit.bind(this)}
            />
            <input className='btn-input' type='submit' value='Submit' disabled={this.state.newSolution.length <= 0} />
          </form>
        </td>
        <td>
          <div>
            <button className='btn-input' onClick={this.approveRequest.bind(this)}>Delete</button>
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
export default connect(mapStateToProps, mapDispachToProps)(PromptRow);

