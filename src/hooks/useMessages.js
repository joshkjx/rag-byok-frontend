import { useState } from 'react';

export function useMessages() {
    const [messages, setMessages] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [error, setError] = useState(null);

    async function send(message) {
        setLoadingStatus(true);
        setError(null);
        try {
            const newMessage = await sendMessage(message);
            setMessages([...messages, newMessage]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoadingStatus(false);
        }
    }
}