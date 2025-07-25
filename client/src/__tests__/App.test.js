import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContent } from '../App';

// Mock all child components following our dependency-only pattern
jest.mock('../components/Header', () => {
  const MockHeader = () => <header data-testid="header">Mock Header</header>;
  return { __esModule: true, default: MockHeader };
});

jest.mock('../components/HomePage', () => {
  const MockHomePage = () => <div data-testid="home-page">Mock Home Page</div>;
  return { __esModule: true, default: MockHomePage };
});

jest.mock('../components/Disclaimer', () => {
  const MockDisclaimer = () => <div data-testid="disclaimer">Mock Disclaimer</div>;
  return { __esModule: true, default: MockDisclaimer };
});

jest.mock('../components/HowItWorks', () => {
  const MockHowItWorks = () => <div data-testid="how-it-works">Mock How It Works</div>;
  return { __esModule: true, default: MockHowItWorks };
});

jest.mock('../components/Footer', () => {
  const MockFooter = () => <footer data-testid="footer">Mock Footer</footer>;
  return { __esModule: true, default: MockFooter };
});

// Mock window methods for viewport height handling
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockSetProperty = jest.fn();

Object.defineProperty(window, 'addEventListener', { value: mockAddEventListener });
Object.defineProperty(window, 'removeEventListener', { value: mockRemoveEventListener });
Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
Object.defineProperty(document.documentElement.style, 'setProperty', { value: mockSetProperty });

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset document state
    document.title = '';
    document.body.className = '';
    mockSetProperty.mockClear();
  });

  // Helper function to render App with router
  const renderApp = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppContent />
      </MemoryRouter>
    );
  };

  describe('Basic Rendering', () => {
    test('renders without crashing', () => {
      renderApp();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders main App structure', () => {
      renderApp();
      expect(document.querySelector('.App')).toBeInTheDocument();
      expect(document.querySelector('.main-content')).toBeInTheDocument();
    });

    test('renders floating particles background', () => {
      renderApp();
      const particles = document.querySelector('.particles');
      expect(particles).toBeInTheDocument();
      
      const particleElements = particles.querySelectorAll('.particle');
      expect(particleElements).toHaveLength(9);
    });
  });

  describe('Route Handling', () => {
    test('renders header and footer for all routes', () => {
      renderApp('/');
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders header and footer for date routes', () => {
      renderApp('/2025-07-10');
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders header and footer for date with story index routes', () => {
      renderApp('/2025-07-10/2');
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders header and footer for disclaimer page', () => {
      renderApp('/disclaimer');
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders header and footer for how it works page', () => {
      renderApp('/how-it-works');
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Page Title Management', () => {
    test('sets a valid page title', async () => {
      renderApp('/');
      
      await waitFor(() => {
        expect(document.title).toContain('Everything Is Awesome');
      });
    });

    test('sets a valid page title for date pages', async () => {
      renderApp('/2025-07-10');
      
      await waitFor(() => {
        expect(document.title).toContain('Everything Is Awesome');
      });
    });

    test('sets a valid page title for date with story index', async () => {
      renderApp('/2025-07-10/2');
      
      await waitFor(() => {
        expect(document.title).toContain('Everything Is Awesome');
      });
    });

    test('sets a valid page title for disclaimer page', async () => {
      renderApp('/disclaimer');
      
      await waitFor(() => {
        expect(document.title).toContain('Everything Is Awesome');
      });
    });

    test('sets a valid page title for how it works page', async () => {
      renderApp('/how-it-works');
      
      await waitFor(() => {
        expect(document.title).toContain('Everything Is Awesome');
      });
    });

    test('sets a valid page title for unknown routes', async () => {
      renderApp('/unknown-route');
      
      await waitFor(() => {
        expect(document.title).toContain('Everything Is Awesome');
      });
    });
  });

  describe('Theme Management', () => {
    test('sets a valid theme for home page', async () => {
      renderApp('/');
      
      await waitFor(() => {
        expect(document.body.className).toMatch(/theme-/);
      });
    });

    test('sets a valid theme for date pages', async () => {
      renderApp('/2025-07-10');
      
      await waitFor(() => {
        expect(document.body.className).toMatch(/theme-/);
      });
    });

    test('sets a valid theme for disclaimer pages', async () => {
      renderApp('/disclaimer');
      
      await waitFor(() => {
        expect(document.body.className).toMatch(/theme-/);
      });
    });

    test('preserves existing theme if already set for news pages', async () => {
      document.body.className = 'theme-science';
      renderApp('/');
      
      await waitFor(() => {
        // Should preserve the existing theme-science
        expect(document.body.className).toBe('theme-science');
      });
    });
  });

  describe('Viewport Height Management', () => {
    test('sets up viewport height event listeners', () => {
      renderApp();
      
      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function));
    });

    test('sets initial viewport height CSS variable', () => {
      renderApp();
      
      expect(mockSetProperty).toHaveBeenCalledWith('--vh', '8px'); // 800 * 0.01 = 8
    });

    test('cleans up event listeners on unmount', () => {
      const { unmount } = renderApp();
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function));
    });
  });

  describe('Initial App Setup', () => {
    test('sets initial theme if none exists', async () => {
      document.body.className = ''; // No theme set
      renderApp();
      
      await waitFor(() => {
        expect(document.body.className).toBe('theme-hope');
      });
    });

    test('preserves existing theme on app load', async () => {
      document.body.className = 'theme-custom existing-class';
      renderApp();
      
      await waitFor(() => {
        // Should preserve existing theme
        expect(document.body.className).toBe('theme-custom existing-class');
      });
    });
  });
});
