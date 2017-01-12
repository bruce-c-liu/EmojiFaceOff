import React, { Component } from 'react';
import main from '../styles/main.css';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import { connect } from 'react-redux';
import { firebaseAuth } from '../config/constants.js';
import wallpaper from '../assets/wallpaper.png';
import Drawer from '../components/UI/Drawer.js';
import mixpanel from 'mixpanel-browser';
import dot_loader from '../assets/loader_three_dots.svg';

class MainContainer extends Component {
  componentWillMount () {
    mixpanel.init('a4ef7ec7ead2231829a3ff9f5d73647c');
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        const userData = user.providerData[0];
        this.props.authUser(user.uid);
        this.props.setUserData(user.uid);
        if (this.props.location.pathname === '/') {
        }
      } else {
        this.props.removeFetchingUser();
      }
    });
  }
  render () {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth // sends auth instance from route to children
      });
    }

    return this.props.isFetching === true
                    ? <div className='loader'>
                          <p>Loading...</p>
                          <img src={dot_loader} alt=""/>  
                       </div>
                    : <div className='inner-container'> {children}<Drawer opened={this.props.drawer} logOut={this.props.logoutAndUnauth} drawerAction={this.props.toggleDrawer} /></div>;
  }

}

export default connect(
  ({users, ui}) => ({
    isAuthed: users.isAuthed,
    isFetching: users.isFetching,
    drawer: ui.drawer
  }),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(MainContainer);

