// Manual mock for react-router-dom - required for Jest module resolution
const React = require('react');

const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default'
};

// Flexible params for testing
let mockParams = {};

const mockSetParams = (params) => {
  mockParams = params;
};

module.exports = {
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
  Link: ({ children, to, className, ...props }) => 
    React.createElement('a', { href: to, className, ...props }, children),
  BrowserRouter: ({ children }) => React.createElement('div', {}, children),
  MemoryRouter: ({ children }) => React.createElement('div', {}, children),
  Routes: ({ children }) => React.createElement('div', {}, children),
  Route: ({ children }) => React.createElement('div', {}, children),
  // Export mock functions for tests to access
  __mockNavigate: mockNavigate,
  __mockLocation: mockLocation,
  __mockSetParams: mockSetParams,
};
