import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>Everything Is Awesome</h1>
        <p>Daily dose of optimistic, feel-good news that restores hope in humanity</p>
      </Link>
    </header>
  );
};

export default Header;
