const AUTH_USER = 'AUTH_USER';
const UNAUTH_USER = 'UNAUTH_USER';
const FETCHING_USER = 'FETCHING_USER';
const FETCHING_USER_DB = 'FETCHING_USER_DB';
const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE';
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS';
const REMOVE_FETCHING_USER = 'REMOVE_FETCHING_USER';
const SET_USER_DATA = 'SET_USER_DATA';


const initialState = {
  isFetching: true,
  error: '',
  isAuthed: false,
  authedId: ''
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
          profile: action.payload
        };
    case FETCHING_USER_DB:
    console.log("case FETCHING_USER_DB", action.payload )    
      return {
        ...state,
        isFetching: false,
        profile: action.payload
      };
      case SET_USER_DATA:
      console.log("case SET_USER_DATA", action.payload )    
        return {
          ...state,
          isFetching: false,
          profile: action.payload
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
    default :
      return state;
  }
}
