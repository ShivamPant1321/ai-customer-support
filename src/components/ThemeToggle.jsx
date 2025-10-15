import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark, isLoading } = useTheme();

  // Don't render if theme is still loading
  if (isLoading) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-3 rounded-2xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-600/20 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-100' 
          : 'bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-500/20 opacity-100'
      }`} />
      
      <div className="relative w-7 h-7 flex items-center justify-center">
        {/* Sun Icon */}
        <motion.div
          animate={{
            rotate: isDark ? 180 : 0,
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.4, 0, 0.2, 1],
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" />
        </motion.div>
        
        {/* Moon Icon */}
        <motion.div
          animate={{
            rotate: isDark ? 0 : -180,
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.4, 0, 0.2, 1],
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
        </motion.div>
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl">
        <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20' 
            : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 opacity-0 group-hover:opacity-20'
        }`} />
      </div>
      
      {/* Sparkle effects on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-blue-400' : 'bg-yellow-400'
            }`}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, Math.random() * 20 - 10],
              y: [0, Math.random() * 20 - 10],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeOut"
            }}
            style={{
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </div>
      
      {/* Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
        Switch to {isDark ? 'light' : 'dark'} mode
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
