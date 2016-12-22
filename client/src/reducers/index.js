import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import users from './users';
import ui from './ui';

const rootReducer = combineReducers({ users, ui, routing: routerReducer });

export default rootReducer;