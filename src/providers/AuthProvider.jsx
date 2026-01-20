import {useEffect, useState, useCallback} from "react";
import api, {setAuthCallback} from "../api/axios.js";
import {AuthContext} from "../contexts/AuthContext.jsx";
import {API_ENDPOINTS} from "../config/config.js";

export function AuthProvider({children}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        setAuthCallback(setIsLoggedIn);
    }, []);

    useEffect(() => {

        async function initAuth() {
            try {
                const response = await api.post(API_ENDPOINTS.REFRESH);
                // if successful refresh, immediately login
                setIsLoggedIn(true);
                setUsername(response?.data?.username);
            } catch (error) {
                console.error('Refresh failed:', error);
                setIsLoggedIn(false);
            }
        }

        initAuth();
    }, []);

    const login = useCallback(
        async (username, password) => {
        try {
            await api.post(API_ENDPOINTS.LOGIN, {
                username,
                password
            });
            setIsLoggedIn(true);
            setUsername(username);
        } catch (error) {
            console.error('Login failed: ', error);
            setIsLoggedIn(false)
        }
    }, []);

    const logout = useCallback(
        async () => {
        try {
            await api.post(API_ENDPOINTS.LOGOUT);
        } catch (error) {
            console.error('logout failed: ', error);
        }
        setIsLoggedIn(false);
    }, []);

    const signup = useCallback(
        async (username, password) => {
        try {
            await api.post(API_ENDPOINTS.SIGNUP, {
                username,
                password
            });
        } catch (error) {
            console.error('signup failed: ', error);
        }
    }, []);

    const value = {
        isLoggedIn,
        login,
        logout,
        setIsLoggedIn,
        signup,
        username
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}