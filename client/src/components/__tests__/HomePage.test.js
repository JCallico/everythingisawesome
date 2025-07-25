import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../HomePage';

// Import the mock functions from the manual mock
const { __mockSetParams } = require('react-router-dom');

// Mock moment for consistent date handling
jest.mock('moment', () => {
  const actual = jest.requireActual('moment');
  return (date) => {
    if (date === '2025-07-10') {
      return {
        format: (format) => {
          if (format === 'MMMM Do, YYYY') return 'July 10th, 2025';
          return '2025-07-10';
        }
      };
    }
    return actual(date);
  };
});

// Mock API service functions
jest.mock('../../services/api', () => ({
  fetchLatestNews: jest.fn(),
  fetchNewsByDate: jest.fn(),
  fetchAvailableDates: jest.fn(),
}));

// Mock child components
jest.mock('../NewsDisplay', () => ({ stories, initialStoryIndex, date }) => (
  <div data-testid="news-display">
    <div data-testid="news-display-stories">{stories?.length || 0} stories</div>
    <div data-testid="news-display-index">{initialStoryIndex}</div>
    <div data-testid="news-display-date">{date}</div>
  </div>
));

jest.mock('../DateSelector', () => ({ visible, onClose, availableDates, currentDate }) => (
  visible ? (
    <div data-testid="date-selector">
      <div data-testid="date-selector-dates">{availableDates?.length || 0} dates</div>
      <div data-testid="date-selector-current">{currentDate}</div>
      <button data-testid="date-selector-close" onClick={onClose}>Close</button>
    </div>
  ) : null
));

const { fetchLatestNews, fetchNewsByDate, fetchAvailableDates } = require('../../services/api');

const mockNewsData = {
  title: 'Today\'s Awesome News',
  date: '2025-07-10',
  stories: [
    {
      id: 1,
      title: 'Amazing Discovery',
      summary: 'Scientists make breakthrough',
      theme: 'science'
    },
    {
      id: 2,
      title: 'Community Success',
      summary: 'Local volunteers achieve goal',
      theme: 'community'
    }
  ]
};

const mockAvailableDates = ['2025-07-10', '2025-07-09', '2025-07-08'];

describe('HomePage Component', () => {
  let originalConsoleError;
  
  beforeEach(() => {
    jest.clearAllMocks();
    fetchAvailableDates.mockResolvedValue(mockAvailableDates);
    // Reset URL parameters to empty (latest news route)
    __mockSetParams({});
    
    // Suppress React act warnings from console
    originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args[0];
      if (
        typeof errorMessage === 'string' && 
        (errorMessage.includes('An update to HomePage inside a test was not wrapped in act(...)') ||
         errorMessage.includes('act(...)')
        )
      ) {
        return; // Suppress React act warnings
      }
      originalConsoleError(...args); // Log other errors normally
    };
  });
  
  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  // Helper function to render component with router
  const renderWithRouter = (route = '/') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <HomePage />
      </MemoryRouter>
    );
  };

  describe('Latest News Loading', () => {
    test('displays loading message for latest news', () => {
      fetchLatestNews.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderWithRouter('/');
      
      expect(screen.getByText('Loading the latest awesome news...')).toBeInTheDocument();
    });

    test('loads and displays latest news successfully', async () => {
      fetchLatestNews.mockResolvedValue(mockNewsData);
      
      renderWithRouter('/');
      
      await waitFor(() => {
        expect(screen.getByText('Today\'s Awesome News')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('news-display')).toBeInTheDocument();
      expect(screen.getByTestId('news-display-stories')).toHaveTextContent('2 stories');
      expect(screen.getByTestId('news-display-index')).toHaveTextContent('0');
      expect(screen.getByTestId('news-display-date')).toHaveTextContent('2025-07-10');
    });

    test('handles latest news fetch error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetchLatestNews.mockRejectedValue(new Error('API Error'));
      
      renderWithRouter('/');
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load latest news. Please try again later.')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Date-Specific News Loading', () => {
    test('displays loading message for specific date', () => {
      __mockSetParams({ date: '2025-07-10' });
      fetchNewsByDate.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderWithRouter('/date/2025-07-10');
      
      expect(screen.getByText('Loading news for July 10th, 2025...')).toBeInTheDocument();
    });

    test('loads and displays news for specific date', async () => {
      __mockSetParams({ date: '2025-07-10' });
      fetchNewsByDate.mockResolvedValue(mockNewsData);
      
      renderWithRouter('/date/2025-07-10');
      
      await waitFor(() => {
        expect(screen.getByText('Today\'s Awesome News')).toBeInTheDocument();
      });
      
      expect(fetchNewsByDate).toHaveBeenCalledWith('2025-07-10');
      expect(screen.getByTestId('news-display-date')).toHaveTextContent('2025-07-10');
    });

    test('handles date-specific news fetch error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      __mockSetParams({ date: '2025-07-10' });
      fetchNewsByDate.mockRejectedValue(new Error('API Error'));
      
      renderWithRouter('/date/2025-07-10');
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load news for this date. Please try another date.')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Back to Latest News')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('handles invalid story index in URL', async () => {
      __mockSetParams({ date: '2025-07-10', storyIndex: '10' });
      fetchNewsByDate.mockResolvedValue(mockNewsData);
      
      renderWithRouter('/date/2025-07-10/story/10'); // Index 10 doesn't exist (only 2 stories)
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load news for this date. Please try another date.')).toBeInTheDocument();
      });
    });

    test('handles valid story index in URL', async () => {
      __mockSetParams({ date: '2025-07-10', storyIndex: '2' });
      fetchNewsByDate.mockResolvedValue(mockNewsData);
      
      renderWithRouter('/date/2025-07-10/story/2'); // 1-based index for second story
      
      await waitFor(() => {
        expect(screen.getByText('Today\'s Awesome News')).toBeInTheDocument();
      });
      
      // Should pass 1 as 0-based index (2-1=1)
      expect(screen.getByTestId('news-display-index')).toHaveTextContent('1');
    });
  });

  describe('No News States', () => {
    test('displays no news message for latest news', async () => {
      __mockSetParams({});
      fetchLatestNews.mockResolvedValue(null);
      
      renderWithRouter('/');
      
      await waitFor(() => {
        expect(screen.getByText('No news available yet. Check back later!')).toBeInTheDocument();
      });
    });

    test('displays no news message for specific date', async () => {
      __mockSetParams({ date: '2025-07-10' });
      fetchNewsByDate.mockResolvedValue(null);
      
      renderWithRouter('/date/2025-07-10');
      
      await waitFor(() => {
        expect(screen.getByText('No news found for this date.')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Back to Latest News')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('opens and closes date selector', async () => {
      fetchLatestNews.mockResolvedValue(mockNewsData);
      
      renderWithRouter('/');
      
      await waitFor(() => {
        expect(screen.getByText('Today\'s Awesome News')).toBeInTheDocument();
      });
      
      // Date selector should not be visible initially
      expect(screen.queryByTestId('date-selector')).not.toBeInTheDocument();
      
      // Click Browse Dates button
      fireEvent.click(screen.getByText('Browse Dates'));
      
      // Date selector should now be visible
      expect(screen.getByTestId('date-selector')).toBeInTheDocument();
      expect(screen.getByTestId('date-selector-dates')).toHaveTextContent('3 dates');
      expect(screen.getByTestId('date-selector-current')).toHaveTextContent('2025-07-10');
      
      // Close date selector
      fireEvent.click(screen.getByTestId('date-selector-close'));
      
      // Date selector should be hidden again
      expect(screen.queryByTestId('date-selector')).not.toBeInTheDocument();
    });

    test('retry button works for latest news error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetchLatestNews.mockRejectedValueOnce(new Error('API Error'))
                   .mockResolvedValueOnce(mockNewsData);
      
      renderWithRouter('/');
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load latest news. Please try again later.')).toBeInTheDocument();
      });
      
      // Click Try Again button
      fireEvent.click(screen.getByText('Try Again'));
      
      await waitFor(() => {
        expect(screen.getByText('Today\'s Awesome News')).toBeInTheDocument();
      });
      
      expect(fetchLatestNews).toHaveBeenCalledTimes(2);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Available Dates Loading', () => {
    test('loads available dates on component mount', async () => {
      fetchLatestNews.mockResolvedValue(mockNewsData);
      
      renderWithRouter('/');
      
      await waitFor(() => {
        expect(fetchAvailableDates).toHaveBeenCalled();
      });
    });

    test('handles available dates fetch error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetchLatestNews.mockResolvedValue(mockNewsData);
      fetchAvailableDates.mockRejectedValue(new Error('API Error'));
      
      renderWithRouter('/');
      
      // Should still render the main content despite dates error
      await waitFor(() => {
        expect(screen.getByText('Today\'s Awesome News')).toBeInTheDocument();
      });
      
      // Date selector should still work (just with empty dates)
      fireEvent.click(screen.getByText('Browse Dates'));
      expect(screen.getByTestId('date-selector-dates')).toHaveTextContent('0 dates');
      
      consoleSpy.mockRestore();
    });
  });

  describe('URL Parameter Handling', () => {
    test('correctly parses story index from URL', async () => {
      __mockSetParams({ date: '2025-07-10', storyIndex: '1' });
      fetchNewsByDate.mockResolvedValue(mockNewsData);
      
      renderWithRouter('/date/2025-07-10/story/1');
      
      await waitFor(() => {
        expect(screen.getByTestId('news-display-index')).toHaveTextContent('0'); // 1-based to 0-based conversion
      });
    });

    test('handles missing story index in URL', async () => {
      __mockSetParams({ date: '2025-07-10' });
      fetchNewsByDate.mockResolvedValue(mockNewsData);
      
      renderWithRouter('/date/2025-07-10');
      
      await waitFor(() => {
        expect(screen.getByTestId('news-display-index')).toHaveTextContent('0'); // Defaults to 0
      });
    });
  });

  describe('API Call Patterns', () => {
    test('calls correct API functions for different routes', async () => {
      // Test latest news route
      __mockSetParams({});
      fetchLatestNews.mockResolvedValue(mockNewsData);
      
      const { rerender } = renderWithRouter('/');
      
      await waitFor(() => {
        expect(fetchLatestNews).toHaveBeenCalled();
        expect(fetchNewsByDate).not.toHaveBeenCalled();
      });
      
      // Clear mocks and test date-specific route
      jest.clearAllMocks();
      fetchAvailableDates.mockResolvedValue(mockAvailableDates);
      __mockSetParams({ date: '2025-07-10' });
      fetchNewsByDate.mockResolvedValue(mockNewsData);
      
      rerender(
        <MemoryRouter initialEntries={['/date/2025-07-10']}>
          <HomePage />
        </MemoryRouter>
      );
      
      await waitFor(() => {
        expect(fetchNewsByDate).toHaveBeenCalledWith('2025-07-10');
        expect(fetchLatestNews).not.toHaveBeenCalled();
      });
    });
  });
});
