import { combineReducers } from 'redux';

import { authReducer, AUTH_NAME } from './modules/auth/index.js';

const combinedReducer = combineReducers({
  [AUTH_NAME]: authReducer,
});

export default combinedReducer;
