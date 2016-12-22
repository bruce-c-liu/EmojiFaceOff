const initialState = {
  roomID: "POOP"
  
}

function session(state = initialState , action) {
  switch(action.type){    
      case 'ROOM.SUCCESS':
      console.log("SESSION GET", action.payload )       
        return Object.assign( { }, state, {
          roomID: action.payload.title
        });

    default:
      return state;
  }
  return state;
}

export default session;
