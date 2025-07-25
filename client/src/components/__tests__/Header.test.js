import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

// Mock react-router-dom dependencies
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default'
};

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, ...props }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
  useLocation: () => mockLocation,
}));

// Mock the image import
jest.mock('../../img/everythingisawesome.jpg', () => 'mocked-awesome-image.jpg');

describe('Header Component', () => {
  test('renders header without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('displays logo image', () => {
    render(<Header />);
    const logo = screen.getByAltText('Everything Is Awesome');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'mocked-awesome-image.jpg');
  });

  test('renders home link', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: /Everything Is Awesome/ });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('renders mobile menu button', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /Toggle navigation menu/ });
    expect(menuButton).toBeInTheDocument();
  });

  test('toggles mobile menu when menu button is clicked', () => {
    render(<Header />);
    
    const menuButton = screen.getByRole('button', { name: /Toggle navigation menu/ });
    
    // Menu should be closed initially - navigation links should not be visible
    expect(screen.queryByRole('link', { name: /🏠 Home/ })).not.toBeInTheDocument();
    
    // Click to open menu
    fireEvent.click(menuButton);
    expect(screen.getByRole('link', { name: /🏠 Home/ })).toBeInTheDocument();
    
    // Click to close menu
    fireEvent.click(menuButton);
    expect(screen.queryByRole('link', { name: /🏠 Home/ })).not.toBeInTheDocument();
  });

  test('renders navigation links when menu is open', () => {
    render(<Header />);
    
    const menuButton = screen.getByRole('button', { name: /Toggle navigation menu/ });
    fireEvent.click(menuButton);
    
    expect(screen.getByRole('link', { name: /🏠 Home/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /⚙️ How It Works/ })).toHaveAttribute('href', '/how-it-works');
    expect(screen.getByRole('link', { name: /📋 Disclaimer/ })).toHaveAttribute('href', '/disclaimer');
  });

  test('applies correct CSS classes', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header');
  });

  test('closes menu when navigation link is clicked', () => {
    render(<Header />);
    
    const menuButton = screen.getByRole('button', { name: /Toggle navigation menu/ });
    
    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByRole('link', { name: /🏠 Home/ })).toBeInTheDocument();
    
    // Click on a navigation link
    const homeLink = screen.getByRole('link', { name: /🏠 Home/ });
    fireEvent.click(homeLink);
    
    // Menu should close
    expect(screen.queryByRole('link', { name: /🏠 Home/ })).not.toBeInTheDocument();
  });
});
