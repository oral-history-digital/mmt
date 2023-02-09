import {
  LOGIN,
  LOGOUT,
} from './action-types';

const initialState = null;

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case LOGOUT:
      return false;
    default:
      return state;
  }
};

export default auth;
