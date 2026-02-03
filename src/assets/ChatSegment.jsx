import React, {useRef, useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatSegment.css';
import {sendQuery} from "../api/messages.js";
import {useAuth} from "../hooks/useAuth.js";
import {useSettings} from "../hooks/useSettings.js";

export function ChatContainer() {
    const [displayText, setDisplayText] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [latestRetrieval, setLatestRetrieval] = useState([]);
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
        setCurrentInput(''); // Clear textbox after sending
        setLatestRetrieval([]); // Clear existing sources

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
            let retrievedDocs = [];
            if (data.type === 'final_state'){
                retrievedDocs.push(...data.sources);
                setLatestRetrieval(retrievedDocs)
                setTimeout(scrollToBottom,100);
            }
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
        <div className="chatContainer">
            <ChatDisplay
                displayText={displayText}
                scrollRef={scrollRef}
                latestRetrieval={latestRetrieval}
            />
            <div className="chatBox">
                <ChatBox
                    textValue={currentInput}
                    onChange={setCurrentInput}
                    onSend={handleSend}
                />
            </div>
        </div>
    );
}

function ChatDisplay( { displayText, scrollRef, latestRetrieval } ) {

    const { apiKey } = useSettings();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return;

        const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;

        if (isNearBottom) {
            element.scrollTop = element.scrollHeight;
        }
    }, [displayText, latestRetrieval, scrollRef]); // scroll when displaytext changes

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
            {(latestRetrieval.length > 0) && <div className = "retrievalContainer" style={{alignItems:'center'}}>
                <p>Latest Documents retrieved: </p>
                {latestRetrieval
                    .filter((d, index, self) =>
                    index === self.findIndex(item => item.filename === d.filename && item.page === d.page))
                    .map(
                    (d) => {
                        const doc = d.filename;
                        const pg = d.page;
                        const key = `${doc}_${pg}`
                        return (
                            <div key={key} style={{display: 'flex', flexDirection:'row', alignContent:'center'}}>
                                <SourceDisplay sourceName={doc} pageNumber={pg} />
                            </div>
                        )
                    }
                )}
            </div>}
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

function SourceDisplay( { sourceName, pageNumber } ) {
    return(
        <div className="sourceDisplay">
            {sourceName} ({pageNumber})
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
        <div className="chatBoxInner">
            <textarea
                ref={textAreaRef}
                value={textValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your documents..."
                rows={1}
                className="textInput"
                disabled={!isLoggedIn || !apiKey}
            />
            <button
                className="chatSendButton"
                onClick={onSend}
                disabled={!textValue.trim() || !isLoggedIn}
            >
                Ask
            </button>
        </div>
    );
}