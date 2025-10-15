import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, MessageCircle, Zap, Clock, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

// Enhanced message formatter with markdown-like support
const formatMessage = (content) => {
  if (!content) return content;
  
  // Clean up asterisks and unwanted formatting first
  let cleanContent = content
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold asterisks but keep content
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic asterisks but keep content
    .replace(/`([^`]+)`/g, '$1') // Remove code formatting
    .replace(/^\*\s+/gm, '• ') // Convert asterisk bullets to proper bullets
    .trim();
  
  const parts = cleanContent.split('\n').map((line, index) => {
    line = line.trim();
    if (!line) return null;
    
    // Handle headers
    if (line.startsWith('# ')) {
      return (
        <h2 key={index} className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 mt-3 first:mt-0">
          {line.substring(2)}
        </h2>
      );
    }
    
    if (line.startsWith('## ')) {
      return (
        <h3 key={index} className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-2 first:mt-0">
          {line.substring(3)}
        </h3>
      );
    }
    
    // Handle bullet points with clean styling
    if (line.startsWith('•') || line.startsWith('-')) {
      return (
        <div key={index} className="flex items-start gap-2 my-1 pl-1">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <span className="flex-1 leading-relaxed text-sm">{line.substring(1).trim()}</span>
        </div>
      );
    }
    
    // Handle numbered steps with clean styling
    if (/^\d+\./.test(line)) {
      const [number, ...rest] = line.split('.');
      return (
        <div key={index} className="flex items-start gap-2 my-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-2 border-blue-500">
          <div className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
            {number}
          </div>
          <span className="flex-1 text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-200">
            {rest.join('.').trim()}
          </span>
        </div>
      );
    }
    
    // Regular paragraphs with clean text
    return (
      <p key={index} className="my-1 leading-relaxed text-gray-700 dark:text-gray-300 text-sm">
        {line}
      </p>
    );
  }).filter(Boolean);
  
  return <div className="space-y-1">{parts}</div>;
};

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const { isDark } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health');
        setConnected(response.ok);
      } catch {
        setConnected(false);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { id: 1, text: "🚀 Getting Started", prompt: "How do I get started with your service?", icon: "🚀", color: "from-blue-500 to-cyan-500" },
    { id: 2, text: "💰 Pricing Plans", prompt: "What are your pricing plans?", icon: "💰", color: "from-green-500 to-emerald-500" },
    { id: 3, text: "🔧 Technical Support", prompt: "I need technical support", icon: "🔧", color: "from-orange-500 to-red-500" },
    { id: 4, text: "📞 Contact Sales", prompt: "How can I contact your sales team?", icon: "📞", color: "from-purple-500 to-pink-500" },
    { id: 5, text: "📋 Documentation", prompt: "Where can I find documentation?", icon: "📋", color: "from-indigo-500 to-blue-500" },
    { id: 6, text: "🛡️ Security & Privacy", prompt: "Tell me about security and privacy", icon: "🛡️", color: "from-gray-600 to-gray-800" },
  ];

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || loading) return;

    const userMessage = { 
      role: 'user', 
      content: messageText, 
      timestamp: new Date(),
      id: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = { 
        role: 'assistant', 
        content: data.response || data.reply || 'Sorry, I could not process your request.',
        timestamp: new Date(),
        id: Date.now() + 1,
        confidence: data.confidence,
        formatted: data.formatted || false
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setConnected(true);
      
      toast.success('Response received!', {
        icon: '🤖',
        duration: 2000,
        style: {
          background: isDark ? '#374151' : '#ffffff',
          color: isDark ? '#f9fafb' : '#374151',
        },
      });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: `## ❌ Connection Error\n\nI'm having trouble connecting right now. Please check:\n\n• Server is running on port 5001\n• Network connection is stable\n• Try refreshing the page\n\nIf the problem persists, please contact support.`,
        timestamp: new Date(),
        id: Date.now() + 1,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setConnected(false);
      toast.error('Connection failed. Please try again.', {
        style: {
          background: isDark ? '#374151' : '#ffffff',
          color: isDark ? '#f9fafb' : '#374151',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (prompt) => {
    sendMessage(prompt);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = () => {
    if (!connected) return <WifiOff className="w-4 h-4 text-red-500" />;
    if (loading) return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    return <Wifi className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-all duration-700">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#374151' : '#ffffff',
            color: isDark ? '#f9fafb' : '#374151',
            border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      
      {/* Professional Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 shadow-lg sticky top-0 z-50 transition-all duration-300"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Company Logo Area */}
              <div className="relative">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-500 dark:via-purple-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Bot className="w-7 h-7 text-white" />
                </motion.div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  AI Assistant Pro
                </h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Intelligent • Reliable • 24/7 Available</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon()}
                    <span className={`text-xs font-medium ${connected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {connected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                  <MessageCircle className="w-4 h-4" />
                  <span>{messageCount} messages</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>Response time: ~1s</span>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-6"> {/* Reduced from max-w-6xl and px-6 py-8 */}
        {/* Main Chat Container - Made Smaller */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden transition-all duration-300 max-w-3xl mx-auto" // Added max-w-3xl and reduced rounded-3xl to rounded-2xl
        >
          {/* Welcome Screen with Enhanced Quick Actions */}
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 text-center"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-500 dark:to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                >
                  <MessageCircle className="w-12 h-12 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  Welcome to AI Assistant Pro
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-base max-w-xl mx-auto leading-relaxed">
                  Your intelligent assistant is ready to help with any questions about our products, services, or support. 
                  Choose from the options below or ask anything directly.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(action.prompt)}
                      className={`group p-4 bg-gradient-to-r ${action.color} text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-left`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xl group-hover:scale-110 transition-transform">
                          {action.icon}
                        </div>
                        <Zap className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
                      </div>
                      <div className="text-base font-semibold mb-1">
                        {action.text.split(' ').slice(1).join(' ')}
                      </div>
                      <div className="text-xs opacity-90 group-hover:opacity-100">
                        Get instant help and information
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Messages Area - Made Smaller */}
          <div className="max-h-[400px] overflow-y-auto p-4 space-y-4 chat-scrollbar">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Enhanced Avatar - Made Smaller */}
                    <motion.div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500' 
                          : msg.isError
                          ? 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500'
                          : 'bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500'
                      }`}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                    >
                      {msg.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </motion.div>

                    {/* Enhanced Message Bubble - Made Smaller */}
                    <motion.div 
                      className={`rounded-xl p-3 shadow-md transition-all duration-300 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white rounded-br-sm'
                          : msg.isError
                          ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700 rounded-bl-sm'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-sm shadow-md backdrop-blur-sm'
                      }`}
                      whileHover={{ y: -1 }}
                    >
                      <div className="text-sm leading-relaxed">
                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            {formatMessage(msg.content)}
                          </div>
                        )}
                      </div>
                      
                      {/* Message Footer - Made Smaller */}
                      <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
                        msg.role === 'user' 
                          ? 'border-blue-400/30' 
                          : msg.isError
                          ? 'border-red-300/30 dark:border-red-600/30'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}> {/* Reduced margin and padding */}
                        <div className={`flex items-center gap-1 text-xs ${
                          msg.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}> {/* Reduced gap from gap-2 */}
                          <Clock className="w-3 h-3" />
                          {formatTime(msg.timestamp)}
                        </div>
                        
                        {msg.confidence && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            {msg.confidence > 0.8 ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-yellow-500" />
                            )}
                            <span>{Math.round(msg.confidence * 100)}%</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Enhanced Typing Indicator - Made Smaller */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500 rounded-xl flex items-center justify-center shadow-md"> {/* Reduced size and shadow */}
                    <Bot className="w-5 h-5 text-white" /> {/* Reduced from w-6 h-6 */}
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-xl rounded-bl-sm px-4 py-3 shadow-md border border-gray-200 dark:border-gray-600"> {/* Reduced padding and shadow */}
                    <div className="flex items-center gap-2"> {/* Reduced gap from gap-3 */}
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              scale: [1, 1.3, 1], 
                              opacity: [0.7, 1, 0.7] 
                            }}
                            transition={{ 
                              duration: 0.8, 
                              repeat: Infinity, 
                              delay: i * 0.2 
                            }}
                            className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium"> {/* Reduced from text-sm */}
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area - Made Smaller */}
          <div className="p-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-t border-gray-200 dark:border-gray-600 transition-all duration-300"> {/* Reduced from p-6 */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3"> {/* Reduced gap from gap-4 */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here... Press Enter to send"
                  className="w-full px-4 py-3 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 shadow-sm transition-all duration-300 text-base"
                  disabled={loading || !connected}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2"> {/* Reduced from right-4 */}
                  <Sparkles className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {/* Reduced from w-5 h-5 */}
                </div>
              </div>
              
              {/* Reduced from scale: 1.05 */}
              {/* Reduced from scale: 0.95 */}
              {/* Reduced padding, gap, and shadow */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading || !input.trim() || !connected}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-600 to-indigo-600 dark:from-purple-600 dark:via-blue-700 dark:to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span className="text-sm">Sending...</span> {/* Reduced text size */}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> {/* Reduced from w-5 h-5 */}
                    <span className="text-sm">Send</span> {/* Reduced text size and text */}
                  </>
                )}
              </motion.button>
            </form>
            
            {/* Connection Status Bar - Made Smaller */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"> {/* Reduced margin from mt-3 */}
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span>
                  {connected ? 'Connected to AI Assistant' : 'Connection lost - please refresh'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>Powered by Gemini AI</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ChatPage;
