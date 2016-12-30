import auth, { logout, saveUser } from '../helpers/auth';
import { CALL_API } from 'redux-api-middleware';
import { SMSInvite, saveNewUser } from '../helpers/http.js';
import { formatUserInfo } from '../helpers/utils';
import { browserHistory } from 'react-router';
import * as shortid from 'shortid';

const AUTH_USER = 'AUTH_USER';
const UNAUTH_USER = 'UNAUTH_USER';
const FETCHING_USER = 'FETCHING_USER';
const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE';
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS';
const REMOVE_FETCHING_USER = 'REMOVE_FETCHING_USER';
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

export function authUser (uid) {
  return {
    type: AUTH_USER,
    uid
  };
}

function unauthUser () {
  return {
    type: UNAUTH_USER
  };
}

function fetchingUser () {
  return {
    type: FETCHING_USER
  };
}

function fetchingUserFailure (error) {
  console.warn(error);
  return {
    type: FETCHING_USER_FAILURE,
    error: 'Error fetching user.'
  };
}

export function fetchingUserSuccess (uid, user, timestamp) {
  return {
    type: FETCHING_USER_SUCCESS,
    uid,
    user,
    timestamp
  };
}

export function fetchAndHandleAuthedUser () {
  return function (dispatch) {
    dispatch(fetchingUser());
    console.log('IN fetchAndHandleAuthedUser action');

    return auth().then(({user, credential}) => {
      const userData = user.providerData[0];
      const userInfo = formatUserInfo(userData.displayName, userData.photoURL, user.uid);
      return dispatch(fetchingUserSuccess(user.uid, userInfo, Date.now()));
    })
    .then(({user}) => saveUser(user))
    .then((user) => dispatch(authUser(user.uid)))
    .catch((error) => dispatch(fetchingUserFailure(error)));
  };
}

export function logoutAndUnauth () {
  return function (dispatch) {
    logout();
    dispatch(unauthUser());
  };
}

export function removeFetchingUser () {
  return {
    type: REMOVE_FETCHING_USER
  };
}

export function fetchRoomId () {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_ROOM',
      payload: shortid.generate()
    });
    browserHistory.push(`/invite`);
  };
}

export function sendSMS (userName, roomUrl, numbers) {
  return function (dispatch) {
    dispatch({
      type: 'IS_LOADING'
    });
    SMSInvite(userName, roomUrl, numbers)
     .then((resp) => {
       console.log('SMS RESP', resp);
       dispatch({
         type: 'IS_LOADED'
       });
       browserHistory.push('/onboard');
     });
  };
}

export function counterInc () {
  return {
    type: 'INVITE_INC'
  };
}
export function counterDec () {
  return {
    type: 'INVITE_DEC'
  };
}

export function playSFX (sound) {
  return {
    type: 'SOUND_FX',
    meta: { sound: sound }
  };
}
