const initialState = {
  loading: false,
  drawer: false
};

function ui (state = initialState, action) {
  switch (action.type) {
    case 'IS_LOADING':
      return Object.assign({}, state, {
        loading: true
      });
    case 'IS_LOADED':
      return Object.assign({}, state, {
        loading: false
      });
      case 'DRAWER':
        return Object.assign({}, state, {
          drawer:!state.drawer
        });
    default:
      return state;
  }
}

export default ui;
