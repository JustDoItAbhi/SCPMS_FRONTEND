// src/components/EnvDebug.jsx
import React from 'react';

const EnvDebug = async() => {
  return (
    <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px' }}>
      <h3>Environment Debug Info:</h3>
      <p>VITE_ENV: {import.meta.env.VITE_DIRECT_BACKEND_URL}</p>
      <p>VITE_API_URL: {import.meta.env.production.VITE_DIRECT_REDIRECT_URI}</p>
      <p>PROD: {import.meta.env ? 'true' : 'false'}</p>
      <p>DEV: {import.meta.env.DEV ? 'true' : 'false'}</p>
      <p>MODE: {import.meta.env.MODE}</p>
    </div>
  );
};

export default EnvDebug;