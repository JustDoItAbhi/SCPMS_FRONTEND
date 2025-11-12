import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();
  console.log("call back");

  const API_BASE_URL = import.meta.env.VITE_DIRECT_BACKEND_URL
  const REDIRECT_URI = import.meta.env.VITE_DIRECT_REDIRECT_URI 


  const handleTokenExchange = async (code) => {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
    console.log("REDIRECT URL ",REDIRECT_URI);
        console.log("BASE URL ",API_BASE_URL);
    
    console.log("6TH REQUEST", clientId, "secret ", clientSecret);
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', REDIRECT_URI); 
        params.append('client_id', clientId);

        console.log("7TH REQUEST");
        
        // ✅ FIXED: Use proper string interpolation
        const response = await axios.post(
            `${API_BASE_URL}/oauth2/token`,  // Fixed backticks
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
                }
            }
        );

        console.log("8TH REQUEST", response);
        // ... rest of your code
    } catch (error) {
        console.error('Token exchange error:', error.response?.data || error.message);
    }
};

     

  useEffect(() => {
    console.log("9TH REQUEST");
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      console.error('OAuth error:', error);
      // navigate("/login");
      return;
    }
    console.log("URL PARAMS ",urlParams);
    if (code) {
      handleTokenExchange(code);
    }
  }, [navigate]);

  return <p>Processing login...</p>;
};

export default Callback;
