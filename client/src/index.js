import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import getRoutes from './config/routes.js';
import store from './store/store.js';
import {firebaseAuth} from './config/constants';
import mixpanel from 'mixpanel-browser';

mixpanel.init('a4ef7ec7ead2231829a3ff9f5d73647c');

const checkLocalStorage = () => {
  for (let key in window.localStorage) {
    if (key.startsWith('firebase:authUser') && window.localStorage[key]) {
      return window.localStorage[key];
    }
  }
  return false;
};

function checkAuth (nextState, replace) {
  let userExists = JSON.parse(checkLocalStorage());
  let name = userExists.displayName.split(' ');

  mixpanel.identify(userExists.uid);
  mixpanel.people.set_once({
    '$first_name': name[0],
    '$last_name': name[1],
    '$email': userExists.email
  });

  if (!firebaseAuth().currentUser && nextState.location.pathname !== '/login' && !userExists) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  } else if (userExists && userExists.role !== 'admin' && nextState.location.pathname === '/pendrequest') {
    // browserHistory.push(`/mode`);
  }
}

ReactDOM.render(
  <Provider store={store}>
    {getRoutes(checkAuth)}
  </Provider>,
  document.getElementById('root')
);
