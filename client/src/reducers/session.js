const initialState = {
  roomID: 'POOP',
  roundCount: 3,
  isHost: false,
  roomType: null,
  inviteURL: ''
};

function session (state = initialState, action) {
  switch (action.type) {
    // case 'SET_ROOM_ID':
    //   return Object.assign({}, state, {
    //     roomID: action.payload
    //   });
    case 'FETCH_ROOM':
      return Object.assign({}, state, {
        roomID: action.payload
      });
    case 'SET_ROOM_TYPE':
      return Object.assign({}, state, {
        roomType: action.payload
      });
    case 'FETCH_BITLY':
      return Object.assign({}, state, {
        inviteURL: action.payload.data.data.url
      });
    case 'ROUND_COUNT_INC':
      return Object.assign({}, state, {
        roundCount: state.roundCount + 5
      });
    case 'ROUND_COUNT_DEC':
      return Object.assign({}, state, {
        roundCount: state.roundCount - 5
      });
    case 'SET_HOST':
      return Object.assign({}, state, {
        isHost: action.payload
      });

    default:
      return state;
  }
}

export default session;
