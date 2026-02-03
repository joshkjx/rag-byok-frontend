export const API_BASE_URL = import.meta.env.VITE_API_URL
export const API_ENDPOINTS = {
    QUERY: '/agent/query',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    DOCUMENT_LIST: '/documents/get',
    DOCUMENT_UPLOAD: '/documents/upload',
    DOCUMENT_DELETE:'/documents/delete'
}
export const SIGNUP_DISABLED = import.meta.env.VITE_SIGNUP_DISABLED