const AUTH_USER = 'AUTH_USER';
const UNAUTH_USER = 'UNAUTH_USER';
const FETCHING_USER = 'FETCHING_USER';
const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE';
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS';
const REMOVE_FETCHING_USER = 'REMOVE_FETCHING_USER';

const initialUserState = {
  lastUpdated: 0,
  info: {
    name: '',
    uid: '',
    avatar: ''

  }
};

function user (state = initialUserState, action) {
  switch (action.type) {
    case FETCHING_USER_SUCCESS :
      return {
        ...state,
        info: action.user,
        lastUpdated: action.timestamp
      };
    default :
      return state;
  }
}

const initialState = {
  isFetching: true,
  error: '',
  isAuthed: false,
  authedId: '',
  coinBalance: 1000
};

export default function users (state = initialState, action) {
  switch (action.type) {
    case AUTH_USER :
      return {
        ...state,
        isAuthed: true,
        authedId: action.uid
      };
    case UNAUTH_USER :
      return {
        ...state,
        isAuthed: false,
        authedId: ''
      };
    case FETCHING_USER:
      return {
        ...state,
        isFetching: true
      };
    case FETCHING_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case REMOVE_FETCHING_USER :
      return {
        ...state,
        isFetching: false
      };
    case FETCHING_USER_SUCCESS:
      return action.user === null
        ? {
          ...state,
          isFetching: false,
          error: ''
        }
        : {
          ...state,
          isFetching: false,
          error: '',
          profile: user(state[action.uid], action)
        };
    default :
      return state;
  }
}
