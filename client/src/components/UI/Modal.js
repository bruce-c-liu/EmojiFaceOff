import React, { Component } from 'react';
import classNames from 'classnames';
import mixpanel from 'mixpanel-browser';

class Modal  extends Component{

  componentDidMount(){
    setTimeout(() => {
      this.setState({
        announceBar: false
      });
    }, 3500);
  }
  render () {
  const { modalOpen }	 = this.props
  const modalClass = classNames({
  	'modal': true,
  	'is-open': modalOpen
  })

    return (
      <div className={modalClass}>
        <button className='btn-dismiss' onClick={this.props.toggleModal}>
          <i className='ion-close-round' />
        </button>
        {this.props.children}
      </div>
    );
  }
}
export default Modal;
