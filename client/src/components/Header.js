import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import classNames from 'classnames';


class Header  extends Component{
 toggleMenu(){
 	this.props.toggleDrawer()
 }
  render () {
  const hamburgerClass = classNames({
  	'hamburger hamburger--elastic': true,
  	'is-active': this.props.drawer
  })
    return (
      <header className="header">
      		<h3>Emoji Faceoff</h3>
      		<button className={hamburgerClass} type="button" onClick={this.toggleMenu.bind(this)}>
      		  <span className="hamburger-box">
      		    <span className="hamburger-inner"></span>
      		  </span>
      		</button> 
      		
      </header>
    )
  }
}
export default connect(
  ({ui}) => ({drawer: ui.drawer}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(Header);