import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators.js';
import axios from 'axios';

class PromptRow extends Component {
  constructor () {
    super();
    this.state = {
      idx: '',
      id: '',
      approved: '',
      origSolution: '',
      newSolution: '',
      deleted: false
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

  deleteSolution (e) {
    e.preventDefault();
    console.log('Delete clicked');
    axios.put('/api/deleteSolution', {
      solutionId: this.state.id,
      newSolution: this.state.newSolution
    })
    .then(result => {
      console.log('Sucessfully deleted', result);
      if (result.status >= 200) {
        this.setState({
          deleted: true
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
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
    axios.put('/api/updateSolution', {
      solutionId: this.state.id,
      newSolution: this.state.newSolution
    })
    .then(result => {
      console.log('Sucessfully updated', result);
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleEdit (e) {
    e.preventDefault();
    this.setState({
      newSolution: e.target.value
    });
  }
  render () {
    const displayNone = {
      display: 'none'
    };
    return (
      <tr style={this.state.deleted ? displayNone : null}>
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
            <p />
            <input className='btn-input' type='submit' value='Update/Approve' disabled={this.state.newSolution.length <= 0} />
          </form>
        </td>
        <td>
          <div>
            <button className='btn-input' onClick={this.deleteSolution.bind(this)}>Delete</button>
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

