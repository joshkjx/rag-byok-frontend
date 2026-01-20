import {useContext} from "react";
import {SettingsContext} from "../contexts/SettingsContext.jsx";

export const useSettings = () => {
    const settings = useContext(SettingsContext)
    if (!settings) {
        throw new Error('useSettings must be used within SettingsProvider')
    }
    return settings;
};