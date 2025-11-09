import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import decodeJWT from "../apps/decodeJWT"

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
       const API_BASE_URL = 'http://localhost:8080';

    console.log("API URL ",API_BASE_URL)

    console.log("Frontend URL:", window.location.href);
    console.log("API_BASE_URL:", API_BASE_URL);
    console.log("Full login URL will be:", import.meta.env.VITE_BASE_URL);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const testing=async()=>{
        try{
            const checking=await axios.get("https://unvocalized-irretrievably-roman.ngrok-free.dev/api/debug/cors");
            console.log("debug test ", checking.data);
        }catch(err){
            console.log(err.message);
        }
    }
    testing();

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const userData = localStorage.getItem('user');
            
            if (token && userData) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setUser(JSON.parse(userData));
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

   const login = async (email, password) => {
    console.log("useAUTH LOGIN PAGE")
    try {
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);
                console.log("ERROR",formData);

        const response = await axios.post("https://unvocalized-irretrievably-roman.ngrok-free.dev/api/auth/login", formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            withCredentials: true
        });
        if(!response){
            console.log("ERROR",formData);
        }
            
            console.log("AUTH RESPONSE ", response.data);
            const { token, user: userData } = response.data;
            
            localStorage.setItem('access_token', token);
            console.log("Token stored in localStorage:", token ? "Yes" : "No");
            
            // Decode the token to get the roles
            const decodedToken = decodeJWT(token);
            console.log("Decoded token:", decodedToken);
            const fullEmail = decodedToken.email || "";
            const username = fullEmail.split('@')[0] || "User";
            console.log("Extracted username:", username);

            const completeUserData = {
                ...userData,
                username: username,
                roles: decodedToken.roles || [],
                grantAuthority: decodedToken.roles 
            };
            
            console.log("Complete user data to store:", completeUserData);
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(completeUserData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(completeUserData);
            
            return response.data;
            
        } catch (error) {
            console.log("Login error:", error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`https://unvocalized-irretrievably-roman.ngrok-free.dev/api/auth/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            window.location.href = '/login';
        }
    };

    const value = {
        user,
        login,
        logout,
        checkAuthStatus,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};