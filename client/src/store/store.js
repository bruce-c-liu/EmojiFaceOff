import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore} from 'react-router-redux';
import { apiMiddleware } from 'redux-api-middleware';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

// import the root reducer
import rootReducer from '../reducers/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 
 const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk, apiMiddleware)
  ));

export const history = syncHistoryWithStore(browserHistory, store);

export default store;