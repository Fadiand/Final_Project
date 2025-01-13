import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';
import { UserProvider } from './componets/UserContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider> {/* עטיפת האפליקציה ב-UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>
);
