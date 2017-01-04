import React, { Component } from 'react';
import {Link} from 'react-router';
import GSAP from 'react-gsap-enhancer';
import {TimelineMax} from 'gsap';
import classNames from 'classnames';

class Drawer  extends Component{



createRevealAnim({ target }) {
    var items = target.find({ name: 'list' }).findAllInChildren()
    console.log("ITEMS",items )
    
    return new TimelineMax()
        .staggerFrom(items, 3, { opacity: 0, scale: 3 }, .12)
}
componentDidMount() {
    //this.createRevealAnim()
  }

getLiStyle(idx) {
    return {
        backgroundColor: idx % 2 ? '#0074D9' : '#FF851B',
    }
}

  render () {
  	const drawerClass = classNames({
  		'drawer': true,
  		'is-open': this.props.opened
  	})
  	const linkData = [
  		{path:'/mode', icon: '🎉', text: 'Start New Game'},
  		{path:'/mode', icon: '🏆', text: 'LeaderBoard'},
  		{path:'/mode', icon: '❔', text: 'Suggest a Question '},
  		{path:'/mode', icon: '✌', text: 'Logout'}
  	]
  	const menuItems =linkData.map((item, idx)=>{
  		return <Link  name={idx} to={item.path}> <span>{item.icon}</span> {item.text} </Link>
  	})
    return (
    	<div className={drawerClass}>
    		<nav className="menu" name="list">
    			{menuItems}
    		</nav>
    	</div>
    )
  }
}
export default GSAP()(Drawer);