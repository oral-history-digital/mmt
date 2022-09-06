import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

import configureStore from './configureStore';
import { MainRoutes } from './modules/routing';

function App() {
  return (
    <Provider store={configureStore()}>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </Provider>
  )
}

export default App
