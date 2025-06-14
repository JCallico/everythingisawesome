import React from 'react';
import { Link } from 'react-router-dom';
import awesomeImage from '../img/everythingisawesome.jpg';

const Header = () => {
  return (
    <header className="header">
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
