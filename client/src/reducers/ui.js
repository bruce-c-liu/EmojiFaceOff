const initialState = {
  loading: false,
  drawer: false,
  formSending: false
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
      case 'FORM_SENDING':
        return Object.assign({}, state, {
          formSending:true
        });
      case 'FORM_SENT':
        return Object.assign({}, state, {
          formSending:false
        });
    default:
      return state;
  }
}

export default ui;
