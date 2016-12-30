import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import {Table, Column, Cell} from 'fixed-data-table';

class PendRequest extends Component {
  constructor () {
    super();
    this.state = {
      rows: [
              ['a1', 'b1', 'c1'],
              ['a2', 'b2', 'c2'],
              ['a3', 'b3', 'c3']
      ]

    };
  }

  componentWillMount () {
    // console.log(this.props);
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
            header={<Cell>Col 1</Cell>}
            cell={<Cell>Column 1 static content</Cell>}
            width={200}
            fixed
          />
          <Column
            header={<Cell>Col 2</Cell>}
            width={100}
            flexGrow={2}
          />
          <Column
            header={<Cell>Col 3</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                Data for column 3: {this.state.rows[rowIndex][2]}
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
