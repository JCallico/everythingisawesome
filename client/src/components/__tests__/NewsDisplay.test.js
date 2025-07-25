import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsDisplay from '../NewsDisplay';

// Mock the API service
jest.mock('../../services/api', () => ({
  resolveImageUrl: jest.fn((url) => `resolved-${url}`),
}));

// Mock window.history.replaceState
const mockReplaceState = jest.fn();
Object.defineProperty(window, 'history', {
  value: {
    replaceState: mockReplaceState,
  },
});

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
});

describe('NewsDisplay Component', () => {
  const mockStories = [
    {
      id: 1,
      title: 'Amazing Discovery in Science',
      summary: 'Scientists have made an incredible breakthrough that will change everything.',
      image: '/images/science.jpg',
      theme: 'science',
      source: 'Science Daily',
      link: 'https://example.com/science',
    },
    {
      id: 2,
      title: 'Community Comes Together',
      summary: 'Local community shows the power of working together for a common cause.',
      image: '/images/community.jpg',
      theme: 'community',
      source: 'Local News',
      link: 'https://example.com/community',
    },
    {
      id: 3,
      title: 'Innovation Breakthrough',
      summary: 'New technology promises to improve lives around the world.',
      image: '/images/innovation.jpg',
      theme: 'innovation',
      source: 'Tech News',
      link: 'https://example.com/innovation',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset body className
    document.body.className = '';
    // Mock scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  test('renders without crashing', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    expect(screen.getByText('Amazing Discovery in Science')).toBeInTheDocument();
  });

  test('displays first story by default', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    expect(screen.getByText('Amazing Discovery in Science')).toBeInTheDocument();
    expect(screen.getByText(/Scientists have made an incredible breakthrough/)).toBeInTheDocument();
  });

  test('displays story at specified initial index', () => {
    render(<NewsDisplay stories={mockStories} initialStoryIndex={1} date="2025-07-10" />);
    
    expect(screen.getByText('Community Comes Together')).toBeInTheDocument();
    expect(screen.getByText(/Local community shows the power/)).toBeInTheDocument();
  });

  test('applies theme to body based on current story', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    expect(document.body.className).toBe('theme-science');
  });

  test('navigates to next story', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const nextButton = screen.getByRole('button', { name: '▶' });
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Community Comes Together')).toBeInTheDocument();
    expect(document.body.className).toBe('theme-community');
  });

  test('navigates to previous story', () => {
    render(<NewsDisplay stories={mockStories} initialStoryIndex={1} date="2025-07-10" />);
    
    const prevButton = screen.getByRole('button', { name: '◀' });
    fireEvent.click(prevButton);
    
    expect(screen.getByText('Amazing Discovery in Science')).toBeInTheDocument();
    expect(document.body.className).toBe('theme-science');
  });

  test('wraps around to first story from last', () => {
    render(<NewsDisplay stories={mockStories} initialStoryIndex={2} date="2025-07-10" />);
    
    const nextButton = screen.getByRole('button', { name: '▶' });
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Amazing Discovery in Science')).toBeInTheDocument();
  });

  test('wraps around to last story from first', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const prevButton = screen.getByRole('button', { name: '◀' });
    fireEvent.click(prevButton);
    
    expect(screen.getByText('Innovation Breakthrough')).toBeInTheDocument();
  });

  test('updates URL when navigating stories', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const nextButton = screen.getByRole('button', { name: '▶' });
    fireEvent.click(nextButton);
    
    expect(mockReplaceState).toHaveBeenCalledWith(null, '', '/2025-07-10/2');
  });

  test('updates URL to date-only when navigating to first story', () => {
    render(<NewsDisplay stories={mockStories} initialStoryIndex={1} date="2025-07-10" />);
    
    const prevButton = screen.getByRole('button', { name: '◀' });
    fireEvent.click(prevButton);
    
    expect(mockReplaceState).toHaveBeenCalledWith(null, '', '/2025-07-10');
  });

  test('displays story progress dots', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const progressDots = document.querySelectorAll('.progress-dot');
    expect(progressDots).toHaveLength(3);
    
    // First dot should be active
    expect(progressDots[0]).toHaveClass('active');
  });

  test('displays story image', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const image = screen.getByAltText('Amazing Discovery in Science');
    expect(image).toBeInTheDocument();
    // Just verify the resolveImageUrl was called
    const { resolveImageUrl } = require('../../services/api');
    expect(resolveImageUrl).toHaveBeenCalled();
  });

  test('handles story without image gracefully', () => {
    const storiesWithoutImage = [
      {
        ...mockStories[0],
        image: null,
      },
    ];
    
    render(<NewsDisplay stories={storiesWithoutImage} date="2025-07-10" />);
    
    expect(screen.getByText('Amazing Discovery in Science')).toBeInTheDocument();
    // Should fallback to theme-based image
    const image = screen.getByAltText('Amazing Discovery in Science');
    expect(image).toBeInTheDocument();
    // Verify the fallback image function was called
    const { resolveImageUrl } = require('../../services/api');
    expect(resolveImageUrl).toHaveBeenCalledWith('/generated-images/fallback-science.png');
  });

  test('renders read more link', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const readMoreLink = screen.getByRole('link', { name: /Read Full Story/ });
    expect(readMoreLink).toBeInTheDocument();
    expect(readMoreLink).toHaveAttribute('href', 'https://example.com/science');
    expect(readMoreLink).toHaveAttribute('target', '_blank');
    expect(readMoreLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('handles empty stories array', () => {
    render(<NewsDisplay stories={[]} date="2025-07-10" />);
    
    // Should not crash, but won't display content
    expect(screen.queryByText('Amazing Discovery in Science')).not.toBeInTheDocument();
  });

  test('prevents rapid navigation clicks', async () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const nextButton = screen.getByRole('button', { name: '▶' });
    
    // Click multiple times rapidly
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    // Should only advance one story (due to transition prevention)
    await waitFor(() => {
      expect(screen.getByText('Community Comes Together')).toBeInTheDocument();
    });
  });

  test('toggles pause/play when pause button is clicked', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const pauseButton = screen.getByRole('button', { name: '⏸' });
    fireEvent.click(pauseButton);
    
    // Should now show play button with paused class
    const playButton = document.querySelector('.pause-btn.paused');
    expect(playButton).toBeInTheDocument();
    expect(playButton).toHaveTextContent('▶');
  });

  test('preserves scroll position during navigation', () => {
    // Set scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 300,
    });
    
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const nextButton = screen.getByRole('button', { name: '▶' });
    fireEvent.click(nextButton);
    
    expect(mockScrollTo).toHaveBeenCalledWith(0, 300);
  });

  test('applies correct CSS classes', () => {
    render(<NewsDisplay stories={mockStories} date="2025-07-10" />);
    
    const container = document.querySelector('.news-display-container');
    expect(container).toBeInTheDocument();
    
    const storyContainer = container.querySelector('.story-container');
    expect(storyContainer).toBeInTheDocument();
    
    const content = container.querySelector('.story-content');
    expect(content).toBeInTheDocument();
  });

  test('handles theme fallback', () => {
    const storyWithoutTheme = [
      {
        ...mockStories[0],
        theme: null,
      },
    ];
    
    render(<NewsDisplay stories={storyWithoutTheme} date="2025-07-10" />);
    
    expect(document.body.className).toBe('theme-hope');
  });
});
