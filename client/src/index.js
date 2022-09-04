import React from 'react'
import ReactDOM from 'react-dom/client'

import './i18n';
import App from './App'

console.log(import.meta.env.VITE_API_HOST);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
