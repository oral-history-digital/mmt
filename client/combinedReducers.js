import { combineReducers } from 'redux';

import { activitiesReducer, ACTIVITIES_NAME } from './modules/activities/index.js';
import { authReducer, AUTH_NAME } from './modules/auth/index.js';

const combinedReducer = combineReducers({
  [ACTIVITIES_NAME]: activitiesReducer,
  [AUTH_NAME]: authReducer,
});

export default combinedReducer;
