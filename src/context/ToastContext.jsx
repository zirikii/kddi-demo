/* eslint-disable react-refresh/only-export-components -- provider + useToast hook are intentionally colocated */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import ToastViewport from '../components/ui/ToastViewport.jsx';

const ToastContext = createContext(null);

/** Provides `push()` and renders the toast viewport. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    idRef.current += 1;
    const id = `toast-${idRef.current}`;
    setToasts((prev) => [...prev, { id, ...toast }]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
