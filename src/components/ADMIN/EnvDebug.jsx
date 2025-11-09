// src/components/EnvDebug.jsx
import React from 'react';

const EnvDebug = () => {
  return (
    <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px' }}>
      <h3>Environment Debug Info:</h3>
      <p>VITE_ENV: {import.meta.env.VITE_ENV}</p>
      <p>VITE_API_URL: {import.meta.env.VITE_API_URL}</p>
      <p>PROD: {import.meta.env.PROD ? 'true' : 'false'}</p>
      <p>DEV: {import.meta.env.DEV ? 'true' : 'false'}</p>
      <p>MODE: {import.meta.env.MODE}</p>
    </div>
  );
};

export default EnvDebug;