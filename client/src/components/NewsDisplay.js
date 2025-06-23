import React, { useState, useEffect, useCallback } from 'react';
import { resolveImageUrl, getImageBaseUrl } from '../services/api';

const NewsDisplay = ({ stories, initialStoryIndex = 0, date }) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Get theme from story data (pre-calculated during news fetching)
  const getThemeFromStory = (story) => {
    // Simply return the theme from the story data (all stories now have themes)
    return story.theme || 'hope'; // Fallback to 'hope' if somehow missing
  };

  // Sync current index with URL parameter
  useEffect(() => {
    if (stories && stories.length > 0) {
      const validIndex = Math.max(0, Math.min(initialStoryIndex, stories.length - 1));
      setCurrentIndex(validIndex);
    }
  }, [initialStoryIndex, stories]);

  // Function to change story while preserving scroll position
  const changeStoryWithScrollPreservation = useCallback((newIndex) => {
    // Store current scroll position
    const scrollY = window.scrollY || window.pageYOffset || 0;
    
    // Update the story state immediately
    setCurrentIndex(newIndex);
    
    // Update URL using history.replaceState to avoid triggering router navigation
    const newUrl = newIndex === 0 ? `/${date}` : `/${date}/${newIndex + 1}`;
    window.history.replaceState(null, '', newUrl);
    
    // Maintain scroll position since we're not using React Router navigation
    window.scrollTo(0, scrollY);
  }, [date]);

  // Auto transition effect
  useEffect(() => {
    if (!stories || stories.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        const newIndex = (currentIndex + 1) % stories.length;
        
        // For auto-transitions, only preserve scroll if user has scrolled significantly
        const shouldPreserveScroll = window.scrollY > 200;
        
        if (shouldPreserveScroll) {
          changeStoryWithScrollPreservation(newIndex);
        } else {
          // For auto-transitions near the top, allow natural scroll to top
          setCurrentIndex(newIndex);
          const newUrl = newIndex === 0 ? `/${date}` : `/${date}/${newIndex + 1}`;
          window.history.replaceState(null, '', newUrl);
        }
        
        setIsTransitioning(false);
      }, 300);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [stories, isPaused, currentIndex, changeStoryWithScrollPreservation, date]);

  // Update body theme when story changes
  useEffect(() => {
    if (stories && stories[currentIndex]) {
      const theme = getThemeFromStory(stories[currentIndex]);
      // Add 'theme-' prefix for CSS classes
      document.body.className = `theme-${theme}`;
    }
  }, [currentIndex, stories]);

  // Navigation functions
  const goToPrevious = () => {
    if (isTransitioning) return; // Prevent multiple rapid clicks
    setIsTransitioning(true);
    
    const newIndex = (currentIndex - 1 + stories.length) % stories.length;
    changeStoryWithScrollPreservation(newIndex);
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning) return; // Prevent multiple rapid clicks
    setIsTransitioning(true);
    
    const newIndex = (currentIndex + 1) % stories.length;
    changeStoryWithScrollPreservation(newIndex);
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToStory = (index) => {
    if (isTransitioning || index === currentIndex) return; // Prevent unnecessary changes
    setIsTransitioning(true);
    
    changeStoryWithScrollPreservation(index);
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Generate image URL from story data or fallback to themed local image
  const getStoryImage = (story) => {
    // Use the image from the story data if available
    if (story.image && story.image !== 'placeholder') {
      return resolveImageUrl(story.image, getImageBaseUrl());
    }
    
    // Fallback to themed local images based on story theme (pre-calculated)
    const theme = story.theme || 'hope';
    return resolveImageUrl(`/generated-images/fallback-${theme}.png`, getImageBaseUrl());
  };

  if (!stories || stories.length === 0) {
    return (
      <div className="news-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing news...</p>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="news-display-container">
      {/* Progress indicators */}
      <div className="story-progress">
        {stories.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToStory(index)}
          />
        ))}
      </div>

      {/* Main story display */}
      <div className={`story-container ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="awesome-badge">
          <span className="awesome-score">{currentStory.awesome_index}</span>
          <span className="awesome-label">Awesome</span>
        </div>

        <div className="story-image-container">
          <img
            src={getStoryImage(currentStory)}
            alt={currentStory.title}
            className="story-image"
          />
          <div className="image-overlay"></div>
        </div>

        <div className="story-content">
          <h2 className="story-title">{currentStory.title}</h2>
          <p className="story-summary">{currentStory.summary}</p>

          <div className="story-actions">
            <a
              href={currentStory.link}
              target="_blank"
              rel="noopener noreferrer"
              className="read-more-btn"
            >
              Read Full Story
              <span className="btn-icon">✨</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="navigation-controls">
        <button
          onClick={goToPrevious}
          className="nav-btn prev-btn"
          disabled={isTransitioning}
        >
          <span>◀</span>
        </button>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`pause-btn ${isPaused ? 'paused' : ''}`}
        >
          {isPaused ? '▶' : '⏸'}
        </button>

        <button
          onClick={goToNext}
          className="nav-btn next-btn"
          disabled={isTransitioning}
        >
          <span>▶</span>
        </button>
      </div>
    </div>
  );
};

export default NewsDisplay;
