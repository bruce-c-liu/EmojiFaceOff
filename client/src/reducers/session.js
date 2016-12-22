const initialState = {
  roomID: "POOP"
  
}

function session(state = initialState , action) {
  switch(action.type){    
      case 'FETCH_ROOM':
        return Object.assign( { }, state, {
          roomID: action.payload
        });

    default:
      return state;
  }
  return state;
}

export default session;
