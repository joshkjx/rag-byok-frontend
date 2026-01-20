import axios from 'axios'
import { API_ENDPOINTS, API_BASE_URL } from "../config/config.js";

const api = axios.create({
    baseURL: `${API_BASE_URL}`,
    withCredentials: true,

});

let setIsLoggedInCallback = null;

export const setAuthCallback = (callback) => {
    setIsLoggedInCallback = callback;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const errorCode = error.response.data?.error_code;
            const message = error.response.data?.message;

            console.log('error code: ', errorCode);
            console.log('error message: ', message);

            if (setIsLoggedInCallback) {
                setIsLoggedInCallback(false);
            }

        }

        if (error.response?.status === 500) {
            const errorCode = error.response.data?.error_code;
            const message = error.response.data?.message;

            console.log('error code: ', errorCode);
            console.log('error message: ', message);

        }

        return Promise.reject(error);

    }

)

export default api;