import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import awesomeImage from '../img/everythingisawesome.jpg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('.main-content');
      
      if (mainContent) {
        const mainContentScrollY = mainContent.scrollTop;
        
        // Check if scrolling up and past a threshold
        if (mainContentScrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
        
        setLastScrollY(mainContentScrollY);
      }
    };

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        mainContent.removeEventListener('scroll', handleScroll);
      };
    }
  }, [lastScrollY]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'header-shrunk' : ''}`}>
      <Link to="/" style={{ textDecoration: 'none' }} onClick={closeMenu}>
        <div className="header-content">
          <img src={awesomeImage} alt="Everything Is Awesome" className="header-logo" />
          <div className="header-text">
          </div>
        </div>
      </Link>
      
      {/* Simple hamburger menu button - positioned absolutely within header */}
      <button 
        className="simple-nav-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>
      
      {/* Simple dropdown navigation */}
      {isMenuOpen && (
        <nav className="simple-nav-dropdown">
          <Link 
            to="/" 
            className={`simple-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            🏠 Home
          </Link>
          <Link 
            to="/how-it-works" 
            className={`simple-nav-link ${location.pathname === '/how-it-works' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            ⚙️ How It Works
          </Link>
          <Link 
            to="/disclaimer" 
            className={`simple-nav-link ${location.pathname === '/disclaimer' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            📋 Disclaimer
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
