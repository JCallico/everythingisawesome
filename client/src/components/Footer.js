import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          News content sourced from NewsAPI • AI processing by Grok • 
          <Link to="/disclaimer" className="footer-link"> Legal Disclaimer</Link>
        </p>
        <p className="footer-note">
          This is an experimental project combining news aggregation with AI analysis
        </p>
      </div>
    </footer>
  );
};

export default Footer;
