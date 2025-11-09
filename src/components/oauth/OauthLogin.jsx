import React, { useEffect } from "react";
import '../oauth/OauthLoginCss.css'

const OauthLogin = () => {
  // ✅ Correct environment variable access
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const REDIRECT_URI = import.meta.env.PROD 
    ? 'https://scpms-frontend.onrender.com/callback' 
    : 'http://localhost:5173/callback';

  console.log("oauth login");
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("REDIRECT_URI:", REDIRECT_URI);

  useEffect(() => {
    // Check if backend is accessible
    console.log("1ST REQUEST");
    
    // ✅ Fixed template literal syntax
    fetch("http://localhost:8080/")
      .then(response => {
        if (response.ok) {
          console.log('Backend server is running');
        } else {
          console.error('Backend server responded with error:', response.status);
        }
      })
      .catch(error => {
        console.error('Cannot reach backend server:', error);
      });
  }, [API_BASE_URL]); // ✅ Added dependency

  const handleLogin = () => {
    console.log("2ND REQUEST");
    const params = new URLSearchParams({
      response_type: "code",
      client_id: "abhi",
      redirect_uri: 'https://unvocalized-irretrievably-roman.ngrok-free.dev/callback',
      scope: "openid profile",
    });
    
    console.log("1st step call login oauth2 server REQUEST");
    
    const authUrl =  window.location.href = `https://unvocalized-irretrievably-roman.ngrok-free.dev/oauth2/authorize?${params}`;
    console.log("Redirecting to:", authUrl);
    
    window.location.href = authUrl;
  };

  return (
    <div className="but">
      <button onClick={handleLogin}>Login with OAuth2</button>
    </div>
  );
};

export default OauthLogin;