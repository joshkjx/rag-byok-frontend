import React from 'react';
import { useState } from 'react';
import './UtilitiesSegment.css'
import LoginForm from "./LoginForm.jsx";
import {useAuth} from "../hooks/useAuth.js";
import {SettingsPane} from "./SettingsPane.jsx";
import {DocumentPane} from "./DocumentPane.jsx";

export function TabContainer(){
    const [activeTab, setActiveTab] = useState('Documents');
    const tabNames = ['Documents','Settings'];
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return (
            <div className="loginContainer">
                <h2>Please log in to continue</h2>
                <LoginForm />
            </div>
        );
    }

    return ( // produces regular tabbed menu when logged in
        <div className="tabContainer">
            <div className="tabs">
                {tabNames.map(tab => (
                    <TabButton
                    key={tab}
                    label={tab}
                    isActive={activeTab === tab}
                    onClick={()=> setActiveTab(tab)}
                    />
                ))}
            </div>
            <div className='tabContents'>
                {activeTab === 'Documents' && <div> <DocumentPane /> </div>}
                {activeTab === 'Settings' && <div> <SettingsPane /> </div>}
            </div>
        </div>
    );
}

function TabButton({label, isActive, onClick}) {
    return (
        <button
            className={isActive ? 'active' : ''}
            onClick={onClick}>
            {label}
        </button>
    );
}

