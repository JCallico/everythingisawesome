import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NewsPage from './components/NewsPage';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';
import './App.css';

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

  return (
    <Router>
      <div className="App">
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
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;
