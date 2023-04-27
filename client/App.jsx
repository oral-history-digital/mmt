import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import configureStore from './configureStore.js';
import { MainRoutes } from './modules/routing/index.js';
import './styles/main.scss';

function App() {
  return (
    <Provider store={configureStore()}>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
