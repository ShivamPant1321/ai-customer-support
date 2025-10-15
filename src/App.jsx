import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatPage from './pages/ChatPage';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Mark app as ready after mounting
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isAppReady ? 1 : 0, y: isAppReady ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="app-container"
    >
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </Router>
    </motion.div>
  );
}

export default App;
