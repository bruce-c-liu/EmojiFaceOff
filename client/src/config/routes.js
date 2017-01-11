import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { history } from '../store/store.js';

import MainContainer from '../containers/MainContainer';
import Chat from '../components/Chat/Chat';
// import Login from '../components/Login';
import ModeSelect from '../components/ModeSelect';
import Invite from '../components/Invite';
import AuthContainer from '../containers/AuthContainer';
import RequestPrompt from '../components/RequestPrompt';
import PendRequest from '../components/Admin/PendRequest';
import CoinStore from '../components/CoinStore';
import LogoutContainer from '../containers/LogoutContainer';
import Contact from '../components/Contact';

import Library from '../components/Admin/Library';
import LibPrompt from '../components/Admin/LibPrompt';

export default function getRoutes (checkAuth) {
  return (
    <Router history={history}>
      <Route path='/' component={MainContainer} >
        <Route path='login' component={AuthContainer} />
        <Route path='mode' component={ModeSelect} onEnter={checkAuth} />
        <Route path='request' component={RequestPrompt} onEnter={checkAuth} />
        <Route path='admin/pendrequest' component={PendRequest} onEnter={checkAuth} />
        <Route path='invite' component={Invite} onEnter={checkAuth} />
        <Route path='chat/:roomID' component={Chat} onEnter={checkAuth} />
        <Route path='coinstore' component={CoinStore} onEnter={checkAuth} />
        <Route path='admin/library' component={Library} onEnter={checkAuth} />
        <Route path='admin/libprompt/:promptID' component={LibPrompt} onEnter={checkAuth} />
        <Route path='contact' component={Contact} />
        <IndexRoute component={AuthContainer} onEnter={checkAuth} />
      </Route>
      <Route path='logout' component={LogoutContainer} />
    </Router>
  );
}
