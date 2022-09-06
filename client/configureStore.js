import { createStore } from 'redux';
import { devToolsEnhancer } from '@redux-devtools/extension';

import combinedReducers from './combinedReducers';

const configureStore = () => {
  return createStore(
    combinedReducers,
    // preloaded state,
    devToolsEnhancer()
  );
};

export default configureStore;
