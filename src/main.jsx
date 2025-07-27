import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import { AuthProvider } from './contexts/AuthContext'; 
import { register } from './serviceWorkerRegistration';
import './index.css';
import RootRouter from './RootRouter.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
      <AuthProvider> 
        <RootRouter /> 
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

register();
