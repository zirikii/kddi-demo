import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { EscalationProvider } from './context/EscalationContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <EscalationProvider>
        <App />
      </EscalationProvider>
    </ToastProvider>
  </StrictMode>,
);
