import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import getRoutes from './config/routes.js';
import { checkIfAuthed } from './helpers/auth.js';
import store from './store/store.js';

// function checkAuth (nextState, replace) {
//   if (store.getState().isFetching === true) {
//     return;
//   }
//   const isAuthed = checkIfAuthed(store);
//   const nextPathName = nextState.location.pathname;
//   console.log("nextState",nextState )
//     if(nextPathName === '/login'){

//     }
//     if (isAuthed ) {
//       console.log('AUTH IS TRUE FROM STORE');

//       //replace('/mode');
//     }
//    else {
//       console.log('AUTH IS FALSE FROM STORE');
//       //replace('/login')
//     }

// }

function checkAuth (nextState, replace) {
  if (nextState.location.pathname !== '/login') {
    const isAuthed = checkIfAuthed(store);
    if (!isAuthed) {
          replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
          });
        }
  }
}

ReactDOM.render(
  <Provider store={store}>
    {getRoutes(checkAuth)}
  </Provider>,
  document.getElementById('root')
);
