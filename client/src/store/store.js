import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore} from 'react-router-redux';
import { apiMiddleware } from 'redux-api-middleware';
import soundsMiddleware from 'redux-sounds';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

const soundsData = {
  // If no additional configuration is necessary, we can just pass a string  as the path to our file.
  message: `${process.env.PUBLIC_URL}/sounds/message.mp3`,
  hint: `${process.env.PUBLIC_URL}/sounds/hint.mp3`,
  chime: `${process.env.PUBLIC_URL}/sounds/Selection_Chime.mp3`,
  tap: `${process.env.PUBLIC_URL}/sounds/Button_Click.mp3`,
  tick: `${process.env.PUBLIC_URL}/sounds/Button_Tick.mp3`
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