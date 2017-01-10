import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators.js';
import axios from 'axios';
import LibRow from './LibRow';

class Library extends Component {
  constructor () {
    super();
    this.state = {
      rows: []
    };
  }

  componentDidMount () {
    axios.get(`/api/prompts/${this.props.params.type}`)
    .then(result => {
      console.log(`Prompts get data`, result.data);
      if (result) {
        let storage = [];
        result.data.map((item) => {
          storage.push([
            item.User.imgUrl,
            item.prompt,
            item.Solutions.join(' + '),
            item.promptId
          ]);
          return item;
        });
        this.setState({
          rows: storage
        });
      }
    })
    .catch(err => {
      throw err;
    });
  }

  render () {
    const tableRows = this.state.rows.map((item, idx) => {
      return (
        <LibRow deets={item} key={idx} />
      );
    });

    return (
      <div className='admin-container'>
        <p>In Admin Library</p>
        <table>
          <thead />
          <tbody>
            <tr>
              <th>User</th>
              <th>Prompt</th>
              <th>Answer</th>
              <th>Details</th>
              <th />
            </tr>
            {tableRows}
          </tbody>
        </table>
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
export default connect(mapStateToProps, mapDispachToProps)(Library);

