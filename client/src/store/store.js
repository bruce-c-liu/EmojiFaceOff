import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore} from 'react-router-redux';
import { apiMiddleware } from 'redux-api-middleware';
import soundsMiddleware from 'redux-sounds';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

const soundsData = {
  // If no additional configuration is necessary, we can just pass a string  as the path to our file.
  test: `${process.env.PUBLIC_URL}/sounds/Action_Lock.mp3`,
  blip: `${process.env.PUBLIC_URL}/sounds/Button_Blip.mp3`,
  chime: `${process.env.PUBLIC_URL}/sounds/Selection_Chime.mp3`
}

// Import our Sound Data Object
//import soundsData from '../helpers/soundData.js';

// Pre-load our middleware with our sounds data.
const loadedSoundsMiddleware = soundsMiddleware(soundsData);

// import the root reducer
import rootReducer from '../reducers/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 
 const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk, loadedSoundsMiddleware , apiMiddleware)
  ));

export const history = syncHistoryWithStore(browserHistory, store);

export default store;