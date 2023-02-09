import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import configureStore from './configureStore';
import { MainRoutes } from './modules/routing';
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
