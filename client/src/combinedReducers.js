import { combineReducers } from 'redux';

import { uploadReducer, UPLOAD_NAME } from './modules/upload';
import { authReducer, AUTH_NAME } from './modules/auth';

const combinedReducer = combineReducers({
    [AUTH_NAME]: authReducer,
    [UPLOAD_NAME]: uploadReducer,
});

export default combinedReducer;
