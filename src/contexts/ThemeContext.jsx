import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return safe fallback values instead of throwing error
    return {
      theme: 'light',
      toggleTheme: () => {
        console.warn('useTheme called outside of ThemeProvider. Theme toggle disabled.');
      },
      isDark: false,
      isLoading: false
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          setMounted(true);
          setIsLoading(false);
          return;
        }

        // Get theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;
        
        setTheme(initialTheme);
        
        // Small delay to ensure smooth transition
        await new Promise(resolve => setTimeout(resolve, 50));
        
        setMounted(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing theme:', error);
        setTheme('light'); // Fallback to light theme
        setMounted(true);
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      // Apply theme to document
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // Save to localStorage
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.warn('Could not save theme to localStorage:', error);
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (mounted) {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }
  };

  const contextValue = {
    theme, 
    toggleTheme, 
    isDark: theme === 'dark',
    isLoading: isLoading || !mounted
  };

  // Show loading state while theme is being initialized
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className="transition-colors duration-300 min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
