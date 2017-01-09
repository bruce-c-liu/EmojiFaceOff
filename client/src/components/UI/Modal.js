import React, { Component } from 'react';
import classNames from 'classnames';
import mixpanel from 'mixpanel-browser';

class Modal extends Component {
  render () {
    const { modalOpen }	= this.props;
    const modalClass = classNames({
      'modal': true,
      'is-open': modalOpen
    });
    mixpanel.track('Nav Onboard');
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
