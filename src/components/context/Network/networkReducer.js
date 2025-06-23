import { SET_ONLINE, SET_OFFLINE } from './actionTypes';

const initialState = {
  isOnline: window.navigator.onLine
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ONLINE:
      return { ...state, isOnline: true };
    case SET_OFFLINE:
      return { ...state, isOnline: false };
    default:
      return state;
  }
};

export default networkReducer;
