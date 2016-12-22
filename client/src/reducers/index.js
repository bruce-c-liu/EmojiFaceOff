import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import users from './users';
import ui from './ui';
import session from './session';

const rootReducer = combineReducers({ users, ui, session, routing: routerReducer });

export default rootReducer;