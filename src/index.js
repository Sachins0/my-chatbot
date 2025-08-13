// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NhostClient, NhostReactProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import './index.css';

// 1. Configure the Nhost client
const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_SUB_DOMAIN, // <-- Paste from your Nhost dashboard
  region: process.env.REACT_APP_REGION         // <-- Paste from your Nhost dashboard
});

const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Wrap your App with the Nhost providers
root.render(
  <React.StrictMode>
    <NhostReactProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <App />
      </NhostApolloProvider>
    </NhostReactProvider>
  </React.StrictMode>
);