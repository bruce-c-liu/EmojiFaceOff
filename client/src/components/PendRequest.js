import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import {Table, Column, Cell} from 'fixed-data-table';
import axios from 'axios';

class PendRequest extends Component {
  constructor () {
    super();
    this.state = {
      rows: [
              ['a1', 'b1', 'c1'],
              ['a2', 'b2', 'c2'],
              ['a3', 'b3', 'c3']
      ],
      data: []
    };
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  componentWillMount () {
    axios.get('/api/pendPrompts')
    .then(result => {
      console.log('pending Prompts', result.data);
      if (result) {
        let storage = [
          [],   // col0 user image
          [],   // col1 prompt
          [],   // col2 possible answers
          [],   // col1
          []    // col1
        ];
        let data = result.data;

        data.map((item, index) => {
          storage[index].push(item.User.imgUrl, item.prompt, item.Solutions.join(' + '));
        });
        console.log('Storage', storage);
        this.setState({
          rows: storage
        });
      }
    })
    .catch(err => {
      throw err;
    });
  }

  _onFilterChange (e) {
    if (!e.target.value) {
      this.setState({
        filteredDataList: this._dataList
      });
    }

    var filterBy = e.target.value.toLowerCase();
    var size = this._dataList.getSize();
    var filteredIndexes = [];
    for (var index = 0; index < size; index++) {
      var {firstName} = this._dataList.getObjectAt(index);
      if (firstName.toLowerCase().indexOf(filterBy) !== -1) {
        filteredIndexes.push(index);
      }
    }
  }

  render () {
    return (
      <div>
        <p>In pending requests</p>
        <Table
          rowHeight={50}
          rowsCount={this.state.rows.length}
          width={500}
          height={500}
          headerHeight={50}
        >
          <Column
            header={<Cell>User</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {this.state.rows[rowIndex][0]}
              </Cell>
            )}
            width={50}
            fixed
          />
          <Column
            header={<Cell>Prompt</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {this.state.rows[rowIndex][1]}
              </Cell>
            )}
            width={100}
            flexGrow={2}
          />
          <Column
            header={<Cell>Answers</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {this.state.rows[rowIndex][2]}
              </Cell>
            )}
            width={200}
            flexGrow={1}
          />
        </Table>
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

