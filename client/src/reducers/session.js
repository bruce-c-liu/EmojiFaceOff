const initialState = {
  roomID: "POOP",
  inviteCount: 1
  
}

function session(state = initialState , action) {
  switch(action.type){    
      case 'FETCH_ROOM':
        return Object.assign( { }, state, {
          roomID: action.payload
        });
        case 'INVITE_INC':
        return Object.assign( { }, state, {
          inviteCount:++state.inviteCount
        });
        case 'INVITE_DEC':
        return Object.assign( { }, state, {
          inviteCount:--state.inviteCount
        });

    default:
      return state;
  }
  return state;
}

export default session;
