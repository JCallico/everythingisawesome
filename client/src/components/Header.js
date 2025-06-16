import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import awesomeImage from '../img/everythingisawesome.jpg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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

  return (
    <header className={`header ${isScrolled ? 'header-shrunk' : ''}`}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="header-content">
          <img src={awesomeImage} alt="Everything Is Awesome" className="header-logo" />
          <div className="header-text">
          </div>
        </div>
      </Link>
    </header>
  );
};

export default Header;
