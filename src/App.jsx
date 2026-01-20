import { useState} from 'react'
import './assets/themes.css'
import './App.css'
import {TabContainer} from './assets/UtilitiesSegment.jsx'
import {ChatContainer} from './assets/ChatSegment.jsx'

function App() {
    const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="baseScene">
        <div>
            <div style={{display:"flex"}}>
                <p>Dark Mode</p>
                <DarkModeToggle
                    checked={darkMode}
                    onChange={()=> {
                        document.documentElement.classList.toggle('dark');
                        setDarkMode(!darkMode)}} />
            </div>
        <div style={{display:'flex'}}>
            <ContentFrame />
            <ChatContainer />
        </div>
        </div>
    </div>
  )
}

function ContentFrame() {
    return (
        <div>
            <TabContainer />
        </div>
    )
}

function DarkModeToggle({checked, onChange}) {
    return(
        <label className = "toggle">
            <input
                type="checkbox"
                checked = {checked}
                onChange={onChange}
                />
            <span className="slider"></span>
        </label>
    )
}

export default App
