import { createStore } from 'redux';
import { devToolsEnhancer } from '@redux-devtools/extension';

import combinedReducers from './combinedReducers.js';

const configureStore = () => createStore(
  combinedReducers,
  // preloaded state,
  devToolsEnhancer(),
);

export default configureStore;
