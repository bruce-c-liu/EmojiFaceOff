import React from 'react';
import { Router, Route} from 'react-router';
import { Provider } from 'react-redux';
import  store, { history } from '../store/store.js';
import AuthService from '../helpers/AuthService.js';

import App   from '../containers/App';
import Chat   from '../components/Chat';

const auth = new AuthService('RDcdqraF0aJI1V2gPOwORf0EtdlSVdPs', 'screengroove.auth0.com');


const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

// OnEnter for callback url to parse access_token
const parseAuthHash = (nextState, replace) => {
  if (nextState.location.hash) {
  	console.log("parseAuthHash" )  		
    auth.parseHash(nextState.location.hash)
    replace({ pathname: '/admin' })
  }
}


const routes = (
<Provider store={store}>	
	  <Router history={ history }>	     
		<Route path='/' component={App} />  
			<Route path='chat/:roomID' component={Chat} />  
		<Route/>
	  </Router>
  </Provider>
)

export default routes;