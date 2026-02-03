import { useAuth } from "../hooks/useAuth.js";
import { useSettings } from "../hooks/useSettings.js";
import './SettingsPane.css';
import { SupportedModels } from "../config/SupportedModels.js";

export function SettingsPane(){
    const {apiKey,
        setApiKey,
        modelProvider,
        setModelProvider,
        modelName,
        setModelName } = useSettings();
    const {logout} = useAuth();

    return (
        <div className="settingsPane">
            <div className="warningBadge" role="note">
                We do not store or log your API Keys. Refreshing the page will require you to enter your API Key again.
            </div>
            <SettingsFieldNestedDropdown firstFieldValue={modelProvider}
                                         firstFieldOnChange={setModelProvider}
                                         secondFieldValue={modelName}
                                         secondFieldOnChange={setModelName}
                                         optionsHashmap={SupportedModels} />
            <SettingsFieldText fieldValue={apiKey} onChange={setApiKey} placeholder="API Key" />
            <button onClick={logout} style={{alignSelf: 'center'}}> Sign Out </button>
        </div>
    )
}

function SettingsFieldText({fieldValue, onChange, placeholder}) {
    return (<input type="password" value={fieldValue} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} />)
}

function SettingsFieldDropdown({fieldValue, onChange, placeholder, dropdownOptions, disabled}) {
    return (<select className="dropdownField" value={fieldValue || ''} onChange={(e) => onChange(e.target.value)}  disabled = {disabled}>
        <option value = "" disabled>{placeholder}</option>
        {dropdownOptions.map(option => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
    </select>
    );
}

function SettingsFieldNestedDropdown({firstFieldValue, secondFieldValue, firstFieldOnChange, secondFieldOnChange, optionsHashmap}) {
    const firstLevelOptions = Object.keys(optionsHashmap)

    const availableItems = firstFieldValue ? optionsHashmap[firstFieldValue] : [];

    const handleCategoryFieldChange = (value) => {
        firstFieldOnChange(value);
        secondFieldOnChange('');
    }

    return (
        <div className="nestedDropdowns">
            <SettingsFieldDropdown
                fieldValue={firstFieldValue}
                onChange={handleCategoryFieldChange}
                placeholder="Select Provider"
                dropdownOptions={firstLevelOptions} />

            <SettingsFieldDropdown
                fieldValue={secondFieldValue}
                onChange={secondFieldOnChange}
                placeholder="Select Model"
                dropdownOptions={availableItems}
                disabled = {!firstFieldValue} />

        </div>
    )

}