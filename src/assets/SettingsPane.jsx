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

    return (
        <div className="settingsPane">
            <SettingsFieldNestedDropdown firstFieldValue={modelProvider}
                                         firstFieldOnChange={setModelProvider}
                                         secondFieldValue={modelName}
                                         secondFieldOnChange={setModelName}
                                         optionsHashmap={SupportedModels} />
            <SettingsFieldText fieldValue={apiKey} onChange={setApiKey} placeholder="API Key" />
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