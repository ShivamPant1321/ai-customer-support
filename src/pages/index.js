import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize session
    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
      .then(res => res.json())
      .then(data => setSessionId(data.id))
      .catch(err => console.error('Failed to create session:', err));
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Add assistant response to UI
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          confidence: data.confidence
        }]);

        if (data.escalated) {
          setEscalated(true);
        }
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.',
          error: true
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I could not connect to the server. Please try again.',
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Customer Support</title>
        <meta name="description" content="AI-powered customer support chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
              <h1 className="text-3xl font-bold text-gray-800">Customer Support</h1>
              <p className="text-gray-600 mt-2">
                How can we help you today?
                {escalated && (
                  <span className="ml-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    🎯 Escalated to Human Agent
                  </span>
                )}
              </p>
            </div>

            {/* Chat Messages */}
            <div className="bg-white shadow-lg" style={{ height: '500px', overflowY: 'auto' }}>
              <div className="p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-20">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-lg">Start a conversation!</p>
                    <p className="text-sm mt-2">Ask me anything about our products or services.</p>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : msg.error
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.confidence !== undefined && (
                        <p className="text-xs mt-2 opacity-70">
                          Confidence: {(msg.confidence * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-b-2xl shadow-lg p-6">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
