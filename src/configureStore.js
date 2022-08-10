import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import combinedReducers from './combinedReducers';

const configureStore = () => {
  return createStore(
    combinedReducers,
    composeWithDevTools()
  );
};

export default configureStore;
