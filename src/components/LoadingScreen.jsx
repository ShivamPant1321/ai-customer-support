import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Loader2 } from 'lucide-react';

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-500 dark:via-purple-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
        >
          <Bot className="w-8 h-8 text-white" />
        </motion.div>
        
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
