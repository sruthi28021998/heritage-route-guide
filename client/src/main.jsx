import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '@google/model-viewer';
import App from './App';
import AuthProvider from './context/AuthContext';
import './index.css';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>
);