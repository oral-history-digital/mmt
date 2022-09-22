import { combineReducers } from 'redux';

import { activitiesReducer, ACTIVITIES_NAME } from './modules/activities';
import { authReducer, AUTH_NAME } from './modules/auth';

const combinedReducer = combineReducers({
  [ACTIVITIES_NAME]: activitiesReducer,
  [AUTH_NAME]: authReducer,
});

export default combinedReducer;
