import React, { Component } from 'react';
import main  from '../styles/main.css';

class App extends Component {

  render() {
  	let children = null;
  	if (this.props.children) {
  	  children = React.cloneElement(this.props.children, {
  	    auth: this.props.route.auth //sends auth instance from route to children
  	  })
  	}
    return (
      <div className="wrap">
      		{children}
      </div>
    );
  }
}

export default App;
