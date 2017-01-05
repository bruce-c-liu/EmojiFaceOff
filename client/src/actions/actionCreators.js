import auth, { logout, saveUser } from '../helpers/auth';
import { CALL_API } from 'redux-api-middleware';
import { SMSInvite, getUser, saveNewUser, shortenLink, getRankedRoom, enqueueRankedRoom } from '../helpers/http.js';
import { formatUserInfo } from '../helpers/utils';
import { browserHistory } from 'react-router';
import * as shortid from 'shortid';

const AUTH_USER = 'AUTH_USER';
const UNAUTH_USER = 'UNAUTH_USER';
const FETCHING_USER = 'FETCHING_USER';
const FETCHING_USER_DB = 'FETCHING_USER_DB';
const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE';
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS';
const REMOVE_FETCHING_USER = 'REMOVE_FETCHING_USER';
const SET_ROOM_TYPE = 'SET_ROOM_TYPE';
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

export function authUser (uid) {
  return function (dispatch) {
    dispatch({
      type: AUTH_USER,
      uid
    });
    getUser(uid)
    .then(resp =>{
         dispatch({
          type: FETCHING_USER_DB,
          payload: resp.data
        });
    });
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

// USED WHEN SAVING USER TO DB
export function fetchUserDB (payload) {
  console.log('fetchUserDB called', payload);
  return {
    type: FETCHING_USER_DB,
    payload: payload
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


function goToNextRoute(next) {
  console.log("GOTO NEXT", next )
  browserHistory.push(`${next}`);
}

export function fetchAndHandleAuthedUser(next) {
    return function(dispatch) {
        dispatch(fetchingUser());
        console.log("NEXT", next )      
        return auth().then(({ user, credential }) => {
                const userData = user.providerData[0];
                const userInfo = formatUserInfo(userData.displayName, userData.photoURL, user.uid);
                return dispatch(fetchingUserSuccess(user.uid, userInfo, Date.now()));
            })
            .then(({ user }) => {
              return saveUser(user)
            })
            .then((resp) => {
                if (resp) return dispatch(fetchUserDB(resp.data))
            })
            .then((payload) => {
                if (payload) {
                     dispatch(authUser(payload.payload.auth))   
                     goToNextRoute(next)
                     console.log('END OF PROMISE CHAIN REACHED. HOORAY!~')                      
                }
            })

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

export function setRoomType (type) {
  return {
    type: SET_ROOM_TYPE,
    payload: type
  };
}

export function fetchRoomId (type, fbId) {
  return function (dispatch) {
    let roomId = shortid.generate();
    dispatch({
      type: 'FETCH_ROOM',
      payload: roomId
    });
    dispatch({
      type: 'SET_ROOM'
    });
    if (type === 'friends') {
      browserHistory.push(`/invite`);
    } else if (type === 'ranked') {
      let userELO;
      getUser(fbId)
        .then(result => {
          userELO = result.data.ELO;
          return getRankedRoom(userELO);
        })
        .then(result => {
          // Found a room!
          if (result.matchedRoom) {
            browserHistory.push(`/chat/${result.matchedRoom}`);
          } else {
            enqueueRankedRoom(roomId, userELO);
            browserHistory.push(`/chat/${roomId}`);
          }
        });
    } else if (type === 'solo') {
      browserHistory.push(`/chat/${roomId}`);
    }
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

export function fetchBitlyLink (longURL) {
  return function (dispatch) {
    shortenLink(longURL)
          .then((resp) => {
            console.log('BITLY LINK', resp);
            dispatch({
              type: 'FETCH_BITLY',
              payload: resp
            });
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

export function setHost (boolean) {
  return {
    type: 'SET_HOST',
    payload: boolean
  };
}

export function playSFX (sound) {
  return {
    type: 'SOUND_FX',
    meta: { sound: sound }
  };
}

export function toggleDrawer () {
  return {
    type: 'DRAWER'
  };
}
