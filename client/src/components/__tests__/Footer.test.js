import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock react-router-dom Link component
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, ...props }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}));

describe('Footer Component', () => {
  test('renders footer without crashing', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('displays news source attribution', () => {
    render(<Footer />);
    expect(screen.getByText(/News content sourced from NewsAPI/)).toBeInTheDocument();
    expect(screen.getByText(/AI processing by Grok/)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<Footer />);
    
    const howItWorksLink = screen.getByRole('link', { name: /How It Works/ });
    expect(howItWorksLink).toBeInTheDocument();
    expect(howItWorksLink).toHaveAttribute('href', '/how-it-works');

    const disclaimerLink = screen.getByRole('link', { name: /Legal Disclaimer/ });
    expect(disclaimerLink).toBeInTheDocument();
    expect(disclaimerLink).toHaveAttribute('href', '/disclaimer');
  });

  test('displays experimental project note', () => {
    render(<Footer />);
    expect(screen.getByText(/This is an experimental project/)).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('app-footer');
    
    const content = footer.querySelector('.footer-content');
    expect(content).toBeInTheDocument();
    
    const note = footer.querySelector('.footer-note');
    expect(note).toBeInTheDocument();
  });

  test('links have correct CSS classes', () => {
    render(<Footer />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('footer-link');
    });
  });
});
