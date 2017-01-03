import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import axios from 'axios';
import PendRow from './PendRow';

class PendRequest extends Component {
  constructor () {
    super();
    this.state = {
      rows: []
    };
  }

  componentDidMount () {
    axios.get('/api/pendPrompts')
    .then(result => {
      console.log('pending Prompts', result.data);
      if (result) {
        let storage = [];
        result.data.map((item) => {
          storage.push([
            item.User.imgUrl,
            item.prompt,
            item.Solutions.join(' + '),
            item.promptId
          ]);
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
        <PendRow deets={item} key={idx} />
      );
    });

    return (
      <div>
        <p>In pending requests</p>
        <table>
          <thead />
          <tbody>
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
export default connect(mapStateToProps, mapDispachToProps)(PendRequest);

