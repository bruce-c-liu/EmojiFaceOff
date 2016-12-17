import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './user';
import ui from './ui';
import auth from './auth';

const rootReducer = combineReducers({ user, ui, routing: routerReducer });

export default rootReducer;