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
                console.error('Refresh failed:', error.code);
                setIsLoggedIn(false);
            }
        }

        initAuth();
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;

        const refreshAccess = async () => {
            try {
                const response = await api.post(API_ENDPOINTS.REFRESH);
                setUsername(response?.data?.username);
            } catch (error) {
                console.error('Auto-refresh failed: ', error);
                setIsLoggedIn(false);
            }
        };

        const interval = setInterval(refreshAccess, 14 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isLoggedIn])

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
            console.error('Login failed: ', error.code);
            setIsLoggedIn(false)
            throw error;
        }
    }, []);

    const logout = useCallback(
        async () => {
        try {
            await api.post(API_ENDPOINTS.LOGOUT);
        } catch (error) {
            console.error('logout failed: ', error.code);
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
            console.error('signup failed: ', error.code);
            throw error;
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