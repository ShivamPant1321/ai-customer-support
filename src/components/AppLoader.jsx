import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageCircle, Zap, Brain, Shield } from 'lucide-react';

const AppLoader = ({ progress = 0 }) => {
  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
    size: 2 + Math.random() * 4,
  }));

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-mesh flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40"></div>
      
      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(particle.id) * 50, 0],
            opacity: [0, 0.8, 0],
            scale: [0, particle.size, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Orbital Rings */}
      <motion.div
        variants={orbitVariants}
        animate="animate"
        className="absolute w-96 h-96 border border-blue-300/20 dark:border-blue-400/20 rounded-full"
      />
      <motion.div
        variants={orbitVariants}
        animate="animate"
        style={{ animationDirection: 'reverse' }}
        className="absolute w-80 h-80 border border-purple-300/20 dark:border-purple-400/20 rounded-full border-dashed"
      />
      <motion.div
        variants={orbitVariants}
        animate="animate"
        className="absolute w-64 h-64 border border-indigo-300/20 dark:border-indigo-400/20 rounded-full"
      />

      <div className="relative text-center max-w-lg mx-auto px-8 z-10">
        {/* Main Logo with Enhanced Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.2 
          }}
          className="relative mb-12"
        >
          {/* Glowing Background */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 rounded-full blur-xl"
          />
          
          {/* Main Logo */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-500 dark:via-purple-500 dark:to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl backdrop-blur-sm border border-white/10">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Bot className="w-16 h-16 text-white drop-shadow-lg" />
            </motion.div>
          </div>
          
          {/* Orbiting Icons */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-32 h-32 mx-auto"
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-32 h-32 mx-auto"
          >
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-32 h-32 mx-auto"
          >
            <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-32 h-32 mx-auto"
          >
            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Title with system fonts only */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-6"
        >
          <motion.h1
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="text-5xl font-black mb-3"
            style={{
              background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #f59e0b, #3b82f6)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}
          >
            AI Assistant Pro
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 1 }}
            className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-4"
            style={{ maxWidth: "200px" }}
          />
        </motion.div>

        {/* Enhanced Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-gray-600 dark:text-gray-300 mb-10 text-xl font-medium"
        >
          Initializing intelligent support system...
        </motion.p>

        {/* Enhanced Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative w-80 h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full mx-auto overflow-hidden backdrop-blur-sm border border-white/20">
            <motion.div
              initial={{ width: 0, x: "-100%" }}
              animate={{ 
                width: `${progress}%`,
                x: 0
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex justify-between items-center mt-3 text-sm"
          >
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {progress}% Complete
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5"
            >
              <Zap className="w-5 h-5 text-yellow-500" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex justify-center items-center gap-4 mb-8"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="w-3 h-3 rounded-full"
              style={{
                background: `linear-gradient(45deg, 
                  ${i === 0 ? '#3b82f6' : ''}
                  ${i === 1 ? '#8b5cf6' : ''}
                  ${i === 2 ? '#ec4899' : ''}
                  ${i === 3 ? '#10b981' : ''}
                  ${i === 4 ? '#f59e0b' : ''}
                , transparent)`
              }}
            />
          ))}
        </motion.div>

        {/* Status Messages with Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-blue-500/60 border-t-blue-500 rounded-full"
            />
            <span className="font-medium">Loading AI models and dependencies...</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center gap-1 bg-white/10 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Real-time</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppLoader;
