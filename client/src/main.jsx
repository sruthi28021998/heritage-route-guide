import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import App from './App';
import AuthProvider from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

import('@google/model-viewer');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>
  </ErrorBoundary>
);