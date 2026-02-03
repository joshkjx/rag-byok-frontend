import { useState } from 'react';
import './assets/themes.css';
import './App.css';
import { TabContainer } from './assets/UtilitiesSegment.jsx';
import { ChatContainer } from './assets/ChatSegment.jsx';
import { useAuth } from './hooks/useAuth.js';

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const { username, isLoggedIn } = useAuth();

    const initials = (username || '')
        .split(' ')
        .filter(Boolean)
        .map(name => name[0]?.toUpperCase())
        .slice(0, 2)
        .join('') || 'U';

    const handleToggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        setDarkMode(!darkMode);
    };

    return (
        <div className="appRoot">
            <header className="appHeader">
                <div className="appHeaderSpacer" />
                <div className="appHeaderTitle">BYOK RAG Assistant</div>
                <div className="appHeaderControls">
                    <div className="darkToggle">
                        <span className="darkToggleLabel">Dark Mode</span>
                        <DarkModeToggle
                            checked={darkMode}
                            onChange={handleToggleDarkMode}
                        />
                    </div>
                    {isLoggedIn && (
                        <div className="userInfo">
                            <div className="userAvatar">{initials}</div>
                            <span>{username}</span>
                        </div>
                    )}
                </div>
            </header>
            <main className="appMain">
                <section className="appSidebar">
                    <ContentFrame />
                </section>
                <section className="appChat">
                    <div className="appChatInner">
                        <ChatContainer />
                    </div>
                </section>
            </main>
        </div>
    );
}

function ContentFrame() {
    return <TabContainer />;
}

function DarkModeToggle({ checked, onChange }) {
    return (
        <label className="toggle">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            <span className="slider" />
        </label>
    );
}

export default App;
