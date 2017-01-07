import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import getRoutes from './config/routes.js';
import store from './store/store.js';
import {firebaseAuth} from './config/constants';

const checkLocalStorage = () => {
  for (let key in window.localStorage) {
    if (key.startsWith('firebase:authUser') && window.localStorage[key]) {
      return window.localStorage[key];
    }
    return false;
  }
};

function checkAuth (nextState, replace) {
  let userExists = checkLocalStorage();
  if (!firebaseAuth().currentUser && nextState.location.pathname !== '/login' && !userExists) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  } else if (userExists && userExists.role !== 'admin') {
    // browserHistory.push(`/mode`);
  }
}

ReactDOM.render(
  <Provider store={store}>
    {getRoutes(checkAuth)}
  </Provider>,
  document.getElementById('root')
);
