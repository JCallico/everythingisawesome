import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NewsPage from './components/NewsPage';
import Disclaimer from './components/Disclaimer';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import './App.css';

// Component to handle theme setting based on route
function ThemeHandler() {
  const location = useLocation();
  
  useEffect(() => {
    // For home and news pages, set a fallback theme if none is set
    if (location.pathname === '/' || location.pathname.startsWith('/date/')) {
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

function App() {
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
    <Router>
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
            <Route path="/date/:date" element={<NewsPage />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;
