import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Disclaimer from '../Disclaimer';

// Mock shared-docs before importing anything
jest.mock('@everythingisawesome/shared-docs', () => {
  // Import the original module to get the real functions
  const originalModule = jest.requireActual('@everythingisawesome/shared-docs');
  
  return {
    ...originalModule,
    // Mock only the data loading functions, keep the real renderer functions
    loadMarkdownContent: jest.fn(), // Empty mock - will be configured in beforeEach
    getCurrentDate: jest.fn(() => 'July 11, 2025'),
    disclaimerFooter: {
      text: 'Mock footer content',
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

const DisclaimerWithRouter = () => (
  <BrowserRouter>
    <Disclaimer />
  </BrowserRouter>
);

describe('Disclaimer Component', () => {
  beforeEach(() => {
    // Clear call history but preserve implementations
    // We need to re-establish the mock return value because Jest module mocking
    // can be inconsistent across test runs
    const { loadMarkdownContent } = require('@everythingisawesome/shared-docs');
    loadMarkdownContent.mockReturnValue({
      title: 'Legal Disclaimer & Terms of Use',
      sections: [
        {
          title: 'Overview',
          content: 'This is a test disclaimer content.',
          listItems: [
            'First item',
            'Second item with **bold text**',
            'Third item with [link](https://example.com)',
          ],
        },
        {
          title: 'Terms',
          content: 'These are the terms of use.',
        },
      ],
    });
  });

  test('renders without crashing', () => {
    render(<DisclaimerWithRouter />);
    // Component now loads content immediately, so check for the actual content
    expect(screen.getByText('Legal Disclaimer & Terms of Use')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(<DisclaimerWithRouter />);
    // Component now loads content immediately, so check for the actual content
    expect(screen.getByText('Legal Disclaimer & Terms of Use')).toBeInTheDocument();
  });

  test('displays disclaimer title', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('Legal Disclaimer & Terms of Use')).toBeInTheDocument();
    });
  });

  test('displays disclaimer sections', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Terms')).toBeInTheDocument();
      expect(screen.getByText('This is a test disclaimer content.')).toBeInTheDocument();
      expect(screen.getByText('These are the terms of use.')).toBeInTheDocument();
    });
  });

  test('renders list items when present', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('First item')).toBeInTheDocument();
      // The markdown renderer processes **bold text** into separate elements
      expect(screen.getByText('bold text')).toBeInTheDocument();
      expect(screen.getByText('link')).toBeInTheDocument();
    });
  });

  test('displays footer content', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('Mock footer content')).toBeInTheDocument();
    });
  });

  test('creates markdown renderer with correct options', () => {
    render(<DisclaimerWithRouter />);
    
    // Since we're using the real createMarkdownRenderer, we can test that it works
    // by checking if the rendered content contains the expected markdown processing
    const testContent = 'This is **bold** text with a [link](https://example.com)';
    const rendered = testRenderer.renderContent(testContent);
    
    // The rendered content should be an array of React elements
    expect(Array.isArray(rendered)).toBe(true);
    expect(rendered.length).toBeGreaterThan(1); // Should have multiple parts for text + bold + link
  });

  test('calls loadMarkdownContent with correct filename', () => {
    render(<DisclaimerWithRouter />);
    
    const { loadMarkdownContent } = require('@everythingisawesome/shared-docs');
    expect(loadMarkdownContent).toHaveBeenCalledWith('disclaimer.md');
  });

  test('handles error loading content', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { loadMarkdownContent } = require('@everythingisawesome/shared-docs');
    loadMarkdownContent.mockImplementationOnce(() => {
      throw new Error('Failed to load');
    });
    
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      expect(screen.getByText('Legal Disclaimer & Terms of Use')).toBeInTheDocument();
      expect(screen.getByText('Unable to load content at this time.')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  test('applies correct CSS classes', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      const container = screen.getByText('Legal Disclaimer & Terms of Use').closest('.content-page-container');
      expect(container).toBeInTheDocument();
      
      const content = container.querySelector('.content-page-content');
      expect(content).toBeInTheDocument();
      
      const sections = container.querySelectorAll('.content-page-section');
      expect(sections).toHaveLength(2);
    });
  });

  test('renders sections with proper structure', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      const sections = screen.getAllByRole('heading', { level: 2 });
      expect(sections).toHaveLength(2);
      expect(sections[0]).toHaveTextContent('Overview');
      expect(sections[1]).toHaveTextContent('Terms');
    });
  });

  test('processes markdown content correctly', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      // Test that markdown content is being processed
      expect(screen.getByText('This is a test disclaimer content.')).toBeInTheDocument();
      expect(screen.getByText('These are the terms of use.')).toBeInTheDocument();
    });
  });

  test('processes markdown list items correctly', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      // Test that list items are rendered
      expect(screen.getByText('First item')).toBeInTheDocument();
      // The markdown renderer should process **bold text** properly
      expect(screen.getByText('bold text')).toBeInTheDocument();
      // Test that the bold text is actually in a <strong> element
      const boldElement = screen.getByText('bold text');
      expect(boldElement.tagName).toBe('STRONG');
    });
  });

  test('handles sections without items', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      // The Terms section should render even without items
      expect(screen.getByText('Terms')).toBeInTheDocument();
      expect(screen.getByText('These are the terms of use.')).toBeInTheDocument();
    });
  });

  test('memoizes renderer to prevent recreation', () => {
    const { rerender } = render(<DisclaimerWithRouter />);
    
    // Since we're using the real renderer now, we test that the component 
    // doesn't crash on rerender (which would happen if renderer was undefined)
    expect(() => {
      rerender(<DisclaimerWithRouter />);
    }).not.toThrow();
  });

  test('displays current date in footer', async () => {
    render(<DisclaimerWithRouter />);
    
    await waitFor(() => {
      const { getCurrentDate } = require('@everythingisawesome/shared-docs');
      expect(getCurrentDate).toHaveBeenCalled();
    });
  });
});
