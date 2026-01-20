import api from './axios.js';
import {API_ENDPOINTS} from "../config/config.js";

export const getDocList = async () => {
    const docList = await api.get(API_ENDPOINTS.DOCUMENT_LIST);
    return docList.data;
}

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_content_type', file.type);
    const response = await api.post(API_ENDPOINTS.DOCUMENT_UPLOAD, formData);
    return !!response;
}

export const deleteDocument = async (documentId) => {
    try {
        const response = await api.delete(API_ENDPOINTS.DOCUMENT_DELETE, {
            data: {
                document_id: documentId
            }
        });
        return response.data;
    } catch (error){
        console.error('Failed to delete document: ', error);
        throw error;
    }
}