import React, { useState, useEffect, useRef } from 'react';
import { formatBotResponse, QUICK_ACTIONS } from '../utils/responseFormatter';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const text = formatResponse(data.reply);
      setMessages(ms => [...ms, { text, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    sendMessage();
  };

  const renderMessage = (message) => {
    const isBot = message.sender === 'bot';
    const formattedText = isBot ? formatBotResponse(message.text) : message.text;

    return (
      <div className={`message ${isBot ? 'bot-message' : 'user-message'}`}>
        {isBot && <span className="bot-icon">🤖</span>}
        <div className="message-content">
          {formattedText.split('•').map((line, idx) => 
            idx === 0 ? <p key={idx}>{line}</p> : <li key={idx}>{line.trim()}</li>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="chatbot-container">
      {/* quick-help */}
      {!messages.length && (
        <div className="quick-actions">
          <h3>How can I help you today?</h3>
          <div className="action-buttons">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.id}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action.prompt)}
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* messages */}
      {messages.map((m, i) => {
        const long = m.text.length > 150;
        const show = expanded[i];
        return (
          <div key={i} className={m.isUser ? 'msg user' : 'msg bot'}>
            <p>{long && !show ? m.text.slice(0, 150) + '...' : m.text}</p>
            {long && (
              <button onClick={() => setExpanded(e => ({ ...e, [i]: !e[i] }))}>
                {show ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
      {/* input */}
      <div className="input-container">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;