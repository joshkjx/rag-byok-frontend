import { API_ENDPOINTS, API_BASE_URL } from "../config/config.js";

export async function sendQuery(question, settings, onResponseChunk) {
    const payload = {
        api_key: settings.api_key,
        model_name: settings.model_name,
        provider: settings.provider
    }
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.QUERY}`, { //use fetch here for streaming
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            question: question,
            settings: payload })
    });

    // Handle errors before reading the stream
    if (!response.ok) {
        try {
            const errorData = await response.json();
            const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.errorCode = errorData.error_code;
            error.details = errorData
            throw error;
        } catch (parseError) { // Fallback if the error is not a json message
            if (parseError instanceof Error && parseError.errorCode) {
                throw parseError;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }


    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.startsWith('data')) {
                const raw = line.slice(6); // get rid of the 'data: ' prefix after decoding
                try {
                    const data = JSON.parse(raw);
                    onResponseChunk(data);
                } catch (e) {
                    console.error('Failed to parse: ', raw);
                    console.error('Error Message: ', e.message);
                }
            }
        }
    }
}