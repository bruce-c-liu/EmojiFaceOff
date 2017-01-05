import React, { Component } from 'react';
import { RouteTransition } from 'react-router-transition';
import {spring} from 'react-motion'
import main from '../styles/main.css';
import datatable from '../../node_modules/fixed-data-table/dist/fixed-data-table.css';
import auth from '../helpers/auth.js';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { formatUserInfo } from '../helpers/utils';
import { firebaseAuth } from '../config/constants.js';
import wallpaper from '../assets/wallpaper.png';
import Drawer from '../components/Drawer.js';

class MainContainer extends Component {
  componentWillMount () {
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        const userData = user.providerData[0];
        const userInfo = formatUserInfo(userData.displayName, userData.photoURL, user.uid);
        this.props.authUser(user.uid);
        this.props.fetchingUserSuccess(user.uid, userInfo, Date.now());
        if (this.props.location.pathname === '/') {
          //browserHistory.push(`/mode`);
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
                    ? <div className='loader'><p>Loading...</p></div>
                    : <div className='inner-container'> {children}<Drawer opened={this.props.drawer} logOut={this.props.logoutAndUnauth} drawerAction={this.props.toggleDrawer}/></div>;
  }

}

export default connect(
  ({users, ui}) => ({isAuthed: users.isAuthed, isFetching: users.isFetching, drawer: ui.drawer}),
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(MainContainer);

