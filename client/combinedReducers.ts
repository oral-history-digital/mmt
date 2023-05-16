import { combineReducers } from 'redux';

import { authReducer, AUTH_NAME } from './modules/auth';

const combinedReducer = combineReducers({
  [AUTH_NAME]: authReducer,
});

export default combinedReducer;
