import React, { Component } from 'react';
import classNames from 'classnames';

class Modal  extends Component{
  render () {
  const { modalOpen }	 = this.props
  const modalClass = classNames({
  	'modal': true,
  	'is-open': modalOpen
  })
    return (
      <div className={modalClass}>
      		<button className="btn-dismiss" onClick={this.props.toggleModal}>
      			<i className="ion-close-round"></i>
      		</button>
      		{this.props.children}
      </div>
    )
  }
}
export default Modal