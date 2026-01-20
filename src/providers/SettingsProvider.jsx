import {useState} from "react";
import {SettingsContext} from "../contexts/SettingsContext.jsx";

export function SettingsProvider({children}) {
    const [modelName, setModelName] = useState('');
    const [modelProvider, setModelProvider] = useState('');
    const [apiKey, setApiKey] = useState('');

    const value = {
        apiKey,
        setApiKey,
        modelProvider,
        setModelProvider,
        modelName,
        setModelName
    }
    return (
        <SettingsContext.Provider value={value}> {children} </SettingsContext.Provider>
    )
}