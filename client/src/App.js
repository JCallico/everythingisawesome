import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Disclaimer from './components/Disclaimer';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import './App.css';

// Component to handle theme setting and page title based on route
function ThemeHandler() {
  const location = useLocation();
  
  useEffect(() => {
    // Update page title based on current route
    const getPageTitle = (pathname) => {
      if (pathname === '/') {
        return 'Everything Is Awesome - Positive News That Matters';
      } else if (pathname.match(/^\/\d{4}-\d{2}-\d{2}/)) {
        const pathParts = pathname.split('/').filter(part => part !== '');
        const date = pathParts[0];
        const storyIndex = pathParts[1];
        if (storyIndex) {
          return `Everything Is Awesome - ${date} - Story ${storyIndex}`;
        }
        return `Everything Is Awesome - ${date}`;
      } else if (pathname === '/disclaimer') {
        return 'Legal Disclaimer & Terms of Use - Everything Is Awesome';
      } else if (pathname === '/how-it-works') {
        return 'How It Works - Everything Is Awesome';
      } else {
        return 'Everything Is Awesome';
      }
    };
    
    document.title = getPageTitle(location.pathname);
    
    // For home and news pages, set a fallback theme if none is set
    if (location.pathname === '/' || location.pathname.match(/^\/\d{4}-\d{2}-\d{2}/)) {
      // Only set fallback if no theme is currently applied
      if (!document.body.className.startsWith('theme-')) {
        document.body.className = 'theme-hope'; // Fallback theme
      }
    }
    else{
      document.body.className = 'theme-default';
    }
  }, [location.pathname]);
  
  return null;
}

// Separate AppContent component for testing
export function AppContent() {
  // Handle dynamic viewport height for mobile browsers
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Set initial theme on app load
  useEffect(() => {
    // If no theme is set initially, set a default
    if (!document.body.className || !document.body.className.startsWith('theme-')) {
      document.body.className = 'theme-hope';
    }
  }, []);

  return (
    <div className="App">
      <ThemeHandler />
      
      {/* Floating particles background */}
      <div className="particles">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:date" element={<HomePage />} />
          <Route path="/:date/:storyIndex" element={<HomePage />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
        <Footer />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
