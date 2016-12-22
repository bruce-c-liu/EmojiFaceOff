import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import getRoutes from './config/routes.js';
import { checkIfAuthed } from './helpers/auth.js';
import  store, { history } from './store/store.js';


function checkAuth (nextState, replace) {
  if (store.getState().isFetching === true) {
    return
  }

  const isAuthed = checkIfAuthed(store)
  const nextPathName = nextState.location.pathname
  if (nextPathName === '/' || nextPathName === '/login') {
    if (isAuthed === true) {
      console.log("AUTH IS TRUE FROM STORE" )
        
      replace('/mode')
    }
  } else {
    if (isAuthed !== true) {
      console.log("AUTH IS FALSE FROM STORE" )
      //replace('/nowhere')
    }
  }
}

ReactDOM.render(
	<Provider store={store}>
		{getRoutes(checkAuth)}
	</Provider>,
  	document.getElementById('root')
);
