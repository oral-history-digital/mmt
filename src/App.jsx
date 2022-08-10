import { BrowserRouter } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

import MainRoutes from './components/MainRoutes';

function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  )
}

export default App
