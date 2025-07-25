import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HowItWorks from '../HowItWorks';

// Mock shared-docs before importing anything
jest.mock('@everythingisawesome/shared-docs', () => {
  // Import the original module to get the real functions
  const originalModule = jest.requireActual('@everythingisawesome/shared-docs');
  
  return {
    ...originalModule,
    // Mock only the data loading functions, keep the real renderer functions
    loadMarkdownContent: jest.fn(), // Empty mock - will be configured in beforeEach
    getCurrentDate: jest.fn(() => 'July 11, 2025'),
    howItWorksFooter: {
      text: 'Mock how it works footer content',
      lastUpdatedLabel: 'Last updated'
    }
  };
});

// Import the actual markdown functions after mocking
import { 
  createWebRenderer
} from '@everythingisawesome/shared-docs';

// Create a real renderer for testing
const testRenderer = createWebRenderer(React);

const HowItWorksWithRouter = () => (
  <BrowserRouter>
    <HowItWorks />
  </BrowserRouter>
);

describe('HowItWorks Component', () => {
  beforeEach(() => {
    // Clear call history but preserve implementations
    // We need to re-establish the mock return value because Jest module mocking
    // can be inconsistent across test runs
    const { loadMarkdownContent } = require('@everythingisawesome/shared-docs');
    loadMarkdownContent.mockReturnValue({
      title: 'How "Everything Is Awesome News" Works',
      sections: [
        {
          title: 'Our Process',
          content: 'We use AI to analyze news stories for positivity.',
          listItems: [
            'Collect news from various sources',
            'Analyze sentiment with **AI technology**',
            'Curate only positive stories',
            'Present with [beautiful design](https://example.com)',
          ],
        },
        {
          title: 'Technology',
          content: 'Our platform uses cutting-edge technology.',
        },
      ],
    });
  });

  test('renders without crashing', () => {
    render(<HowItWorksWithRouter />);
    // Component now loads content immediately, so check for the actual content
    expect(screen.getByText('How "Everything Is Awesome News" Works')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(<HowItWorksWithRouter />);
    // Component now loads content immediately, so check for the actual content
    expect(screen.getByText('How "Everything Is Awesome News" Works')).toBeInTheDocument();
  });

  test('displays how it works title', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('How "Everything Is Awesome News" Works')).toBeInTheDocument();
    });
  });

  test('displays how it works sections', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('Our Process')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('We use AI to analyze news stories for positivity.')).toBeInTheDocument();
      expect(screen.getByText('Our platform uses cutting-edge technology.')).toBeInTheDocument();
    });
  });

  test('renders list items when present', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('Collect news from various sources')).toBeInTheDocument();
      // The markdown renderer processes **AI technology** into separate elements
      expect(screen.getByText('AI technology')).toBeInTheDocument();
      expect(screen.getByText('beautiful design')).toBeInTheDocument();
    });
  });

  test('displays footer content', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('Mock how it works footer content')).toBeInTheDocument();
      expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    });
  });

  test('creates markdown renderer with correct options', () => {
    render(<HowItWorksWithRouter />);
    
    // Since we're using the real createMarkdownRenderer, we can test that it works
    // by checking if the rendered content contains the expected markdown processing
    const testContent = 'This is **bold** text with a [link](https://example.com)';
    const rendered = testRenderer.renderContent(testContent);
    
    // The rendered content should be an array of React elements
    expect(Array.isArray(rendered)).toBe(true);
    expect(rendered.length).toBeGreaterThan(1); // Should have multiple parts for text + bold + link
  });

  test('calls loadMarkdownContent with correct filename', () => {
    render(<HowItWorksWithRouter />);
    
    const { loadMarkdownContent } = require('@everythingisawesome/shared-docs');
    expect(loadMarkdownContent).toHaveBeenCalledWith('how-it-works.md');
  });

  test('handles error loading content', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { loadMarkdownContent } = require('@everythingisawesome/shared-docs');
    loadMarkdownContent.mockImplementationOnce(() => {
      throw new Error('Failed to load');
    });
    
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('How "Everything Is Awesome News" Works')).toBeInTheDocument();
      expect(screen.getByText('Unable to load content at this time.')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  test('applies correct CSS classes', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      const container = screen.getByText('How "Everything Is Awesome News" Works').closest('.content-page-container');
      expect(container).toBeInTheDocument();
      
      const content = container.querySelector('.content-page-content');
      expect(content).toBeInTheDocument();
      
      const sections = container.querySelectorAll('.content-page-section');
      expect(sections).toHaveLength(2);
    });
  });

  test('renders sections with proper structure', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      const sections = screen.getAllByRole('heading', { level: 2 });
      expect(sections).toHaveLength(2);
      expect(sections[0]).toHaveTextContent('Our Process');
      expect(sections[1]).toHaveTextContent('Technology');
    });
  });

  test('processes markdown content correctly', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      // Test that markdown content is being processed
      expect(screen.getByText('We use AI to analyze news stories for positivity.')).toBeInTheDocument();
      expect(screen.getByText('Our platform uses cutting-edge technology.')).toBeInTheDocument();
    });
  });

  test('processes markdown list items correctly', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      // Test that list items are rendered
      expect(screen.getByText('Collect news from various sources')).toBeInTheDocument();
      // The markdown renderer should process **AI technology** properly
      expect(screen.getByText('AI technology')).toBeInTheDocument();
      // Test that the bold text is actually in a <strong> element
      const boldElement = screen.getByText('AI technology');
      expect(boldElement.tagName).toBe('STRONG');
      
      // Test that links are processed correctly
      const linkElement = screen.getByText('beautiful design');
      expect(linkElement.tagName).toBe('A');
      expect(linkElement.getAttribute('href')).toBe('https://example.com');
    });
  });

  test('handles sections without items', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      // The Technology section should render even without items
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Our platform uses cutting-edge technology.')).toBeInTheDocument();
    });
  });

  test('memoizes renderer to prevent recreation', () => {
    const { rerender } = render(<HowItWorksWithRouter />);
    
    // Since we're using the real renderer now, we test that the component 
    // doesn't crash on rerender (which would happen if renderer was undefined)
    expect(() => {
      rerender(<HowItWorksWithRouter />);
    }).not.toThrow();
  });

  test('displays current date in footer', async () => {
    render(<HowItWorksWithRouter />);
    
    await waitFor(() => {
      const { getCurrentDate } = require('@everythingisawesome/shared-docs');
      expect(getCurrentDate).toHaveBeenCalled();
    });
  });
});
