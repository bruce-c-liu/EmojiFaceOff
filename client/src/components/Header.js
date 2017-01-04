import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';


class Header  extends Component{
 toggleMenu(){
 	this.props.toggleDrawer()
 }
  render () {
    return (
      <header className="header">
      		<button onClick={this.toggleMenu.bind(this)}>MENU</button>
      		
      </header>
    )
  }
}
export default connect(
  ({ui}) => ({drawer: ui.drawer}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(Header);