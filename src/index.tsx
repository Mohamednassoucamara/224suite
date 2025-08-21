import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

// Vider les caches utilisateurs si la version change
const CACHE_VERSION = process.env.REACT_APP_CACHE_VERSION || '1';
const storedCacheVersion = localStorage.getItem('cache_version');
if (storedCacheVersion !== CACHE_VERSION) {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}
  localStorage.setItem('cache_version', CACHE_VERSION);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
); 