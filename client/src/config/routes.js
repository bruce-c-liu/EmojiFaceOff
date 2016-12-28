import React from 'react';
import { Router, Route, IndexRoute} from 'react-router';
import  store, { history } from '../store/store.js';

import MainContainer   from '../containers/MainContainer';
import Chat   from '../components/Chat/Chat';
import Login   from '../components/Login';
import ModeSelect   from '../components/ModeSelect';
import Invite   from '../components/Invite';
import NoWhere   from '../components/ModeSelect';
import AuthContainer   from '../containers/AuthContainer';



export default function getRoutes (checkAuth) {
  return(
      <Router history={ history }>       
          <Route path='/' component={MainContainer}>  
          	<Route path='login'  component={AuthContainer} onEnter={checkAuth} />
              <Route path='mode'  component={ModeSelect} onEnter={checkAuth} />
              <Route path='invite'  component={Invite} onEnter={checkAuth} />
            	<Route path='chat/:roomID' component={Chat}  onEnter={checkAuth} /> 
            	<Route path='nowhere' component={NoWhere}  />
              <IndexRoute component={AuthContainer} onEnter={checkAuth}/>
          </Route>
      </Router>
    )
}


