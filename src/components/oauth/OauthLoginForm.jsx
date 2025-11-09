import React from 'react';

const OauthLoginForm = () => {
  const API_BASE_URL = import.meta.env.production.VITE_API_URL || 'http://localhost:8080';
  const REDIRECT_URI = import.meta.env.PROD ? 'https://scpms-frontend.onrender.com/callback' : 'http://localhost:5173/callback';


  console.log("4TH REQUEST OAUTH LOGIN FORM")


  const oauthUrl = `http://localhost:8080/oauth2/authorize?response_type=code&client_id=render&redirect_uri=
  ${REDIRECT_URI}&scope=openid profile`;

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Login with OAuth2</h2>
      <a href={oauthUrl}>
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>Login</button>
      </a>
    </div>
  );
};

export default OauthLoginForm;
