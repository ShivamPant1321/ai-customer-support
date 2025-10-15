import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLoader from './components/AppLoader';
import App from './App';
import './styles/globals.css';

const AppWithLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simplified loading process without font preloading
    const loadingSteps = [
      { step: 'Initializing...', progress: 15, delay: 200 },
      { step: 'Loading components...', progress: 40, delay: 400 },
      { step: 'Connecting to AI...', progress: 70, delay: 500 },
      { step: 'Setting up chat...', progress: 90, delay: 300 },
      { step: 'Ready!', progress: 100, delay: 200 }
    ];

    let currentStep = 0;

    const processStep = () => {
      if (currentStep < loadingSteps.length) {
        const { progress: newProgress, delay } = loadingSteps[currentStep];
        
        setTimeout(() => {
          setProgress(newProgress);
          
          if (currentStep === loadingSteps.length - 1) {
            // Final step - hide loader
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          } else {
            currentStep++;
            processStep();
          }
        }, delay);
      }
    };

    // Start loading process
    processStep();
  }, []);

  if (isLoading) {
    return <AppLoader progress={progress} />;
  }

  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithLoader />
  </React.StrictMode>
);
