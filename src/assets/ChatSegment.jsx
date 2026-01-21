import React, {useRef, useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatSegment.css';
import {sendQuery} from "../api/messages.js";
import {useAuth} from "../hooks/useAuth.js";
import {useSettings} from "../hooks/useSettings.js";

export function ChatContainer() {
    const [displayText, setDisplayText] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const scrollRef = useRef(null);

    const { modelName, modelProvider, apiKey } = useSettings();

    function scrollToBottom() {
        if (scrollRef.current){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }

    async function handleSend() {
        if (!currentInput.trim()) return;

        const question = currentInput;
        console.log("sending: ", currentInput);
        setCurrentInput(''); // Clear textbox after sending

        // Adds user message to conversation history
        const userMessage = {role: 'user', content: question};
        setDisplayText(prev => [...prev, userMessage, {role: 'assistant', content: "*Thinking...*"}]); // We add a dummy assistant response as a "container" to hold the update

        setTimeout(scrollToBottom,0);

        const settingsPayload = {
            provider: modelProvider,
            model_name: modelName,
            api_key: apiKey
        }

        let streamedResponse = '';
        await sendQuery(question, settingsPayload, (data) => {
            if (data.type === 'token'){
                streamedResponse += data.content;

                setDisplayText(prev => [
                    ...prev.slice(0,-1),
                    {role: 'assistant', content: streamedResponse}
                ]); // Replace the most recent assistant message with the updated one that has more text chunks
            }
        });

    }

    return (
        <div className = "chatContainer">
            <ChatDisplay
                displayText={displayText}
                scrollRef = {scrollRef}
            />
            <div style={{display:"flex", gap:"5px"}}>
            <ChatBox
                textValue={currentInput}
                onChange={setCurrentInput}
                onSend={handleSend}
            />
        </div>
        </div>
    );
}

function ChatDisplay( { displayText, scrollRef } ) {

    const { apiKey } = useSettings();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return;

        const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;

        if (isNearBottom) {
            element.scrollTop = element.scrollHeight;
        }
    }, [displayText, scrollRef]); // scroll when displaytext changes

    return (
        <div ref={scrollRef} className = "chatDisplay">
            {isLoggedIn && !apiKey && <div className="queryResponse error"> Please add an API Key.</div>}
            <div className = "queryResponse">
                {displayText.map(
                    (msg, index) => {
                        if (msg.role === 'user') {
                            const nextMsg = displayText[index + 1];
                            return (
                                <div key={index} className="qaPair">
                                    <QueryHeader currentQuery={msg.content}/>
                                    {nextMsg?.role === 'assistant' && (
                                        <AnswerDisplay displayText={nextMsg.content}/>
                                    )}
                                </div>
                            );
                        }
                    })}
            </div>
        </div>
    );
}

function QueryHeader({ currentQuery }) {
    return (
        <div className="stickyQuery"> {currentQuery} </div>
    )
}

function AnswerDisplay( { displayText } ) {
        return (
        <div className="responseText">
            <ReactMarkdown>{displayText}</ReactMarkdown>
        </div>
    )
}

function ChatBox({ textValue, onChange, onSend }) {
    const textAreaRef = useRef(null);
    const { isLoggedIn } = useAuth();
    const { apiKey } = useSettings();

    function handleChange(e) {
        onChange(e.target.value);

        const textArea = textAreaRef.current;
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight + 'px';
    }


    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    }

    return (
        <div className = "chatBox">
            <textarea
                ref = {textAreaRef}
                value = {textValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask your question..."
                rows={1}
                className="textInput"
                disabled={!isLoggedIn || !apiKey}/>
            <button className = "chatSendButton" onClick={onSend} disabled={!textValue.trim() || !isLoggedIn}>Ask</button>
        </div>
    );
}