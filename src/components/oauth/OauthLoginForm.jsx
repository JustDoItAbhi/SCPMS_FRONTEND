import React from 'react';

const OauthLoginForm = () => {
  const API_BASE_URL = import.meta.env.VITE_DIRECT_BACKEND_URL
  const REDIRECT_URI = import.meta.env.VITE_DIRECT_REDIRECT_URI


  console.log("4TH REQUEST OAUTH LOGIN FORM")

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Login with OAuth2</h2>
     <a
href = "https://unvocalized-irretrievably-roman.ngrok-free.dev/oauth2/authorize?response_type=code&client_id=render&redirect_uri=https://scpms-frontend.onrender.com/callback&scope=openid profile"
>
  <button style={{ padding: '10px 20px', fontSize: '16px' }}>Login</button>
</a>
    </div>
  );
};


export default OauthLoginForm;
