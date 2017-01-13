import React, { Component } from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';
// import mixpanel from 'mixpanel-browser';
class Drawer extends Component {
  closeDrawer () {
    this.props.drawerAction();
  }
  logOutUser () {

  }
  render () {
  	const drawerClass = classNames({
  		'drawer': true,
  		'is-open': this.props.opened
  	});
  	const linkData = [
  		{path: '/mode', icon: '🎉', text: 'Start New Game'},
              {path: '/coinstore', icon: '🤑', text: 'Coin Store'},
  		{path: '/request', icon: '❔', text: 'Suggest a Question '},
              {path: '/contact', icon: '📫', text: 'Feedback / Contact '},
  		{path: '/logout', icon: '✌', text: 'Logout'}
           
  	];
  	const menuItems = linkData.map((item, idx) => {
  		return <Link to={item.path} key={idx} onClick={this.closeDrawer.bind(this)}> <span>{item.icon}</span> {item.text} </Link>;
  	});
    return (
      <div className={drawerClass}>
        <nav className='menu' name='list'>
          {menuItems}
        </nav>
      </div>
    );
  }
}
export default Drawer;
