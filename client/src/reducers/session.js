const initialState = {
  roomID: 'POOP',
  inviteCount: 1,
  isHost: true
};

function session (state = initialState, action) {
  switch (action.type) {
    case 'FETCH_ROOM':
      return Object.assign({}, state, {
        roomID: action.payload
      });
      case 'FETCH_BITLY':
        return Object.assign({}, state, {
          inviteURL: action.payload.data.data.url
        });
    case 'INVITE_INC':
      return Object.assign({}, state, {
        inviteCount: ++state.inviteCount
      });
    case 'INVITE_DEC':
      return Object.assign({}, state, {
        inviteCount: --state.inviteCount
      });
    case 'SET_HOST':
      return Object.assign({}, state, {
        isHost: true
      });

    default:
      return state;
  }
}

export default session;
