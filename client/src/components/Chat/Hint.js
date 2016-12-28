import React, { Component } from 'react';
import classNames from 'classnames';
class Hint  extends Component{
  render () {
  	const hintClass = classNames({
  		'hint': true,
  		'show-one': this.props.hint.length >= 1
  	})
    return (
      <div className={hintClass}>
      	<span>{this.props.hint}</span>
      </div>
    )
  }
}
export default Hint