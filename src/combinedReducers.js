import { combineReducers } from 'redux';

import { uploadReducer, UPLOAD_NAME } from './modules/upload';

const combinedReducer = combineReducers({
    [UPLOAD_NAME]: uploadReducer,
});

export default combinedReducer;
