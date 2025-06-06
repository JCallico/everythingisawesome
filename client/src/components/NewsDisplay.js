import React, { useState, useEffect } from 'react';

const NewsDisplay = ({ stories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Color themes based on story content
  const getThemeFromStory = (story) => {
    const title = story.title.toLowerCase();
    const summary = story.summary.toLowerCase();
    const text = title + ' ' + summary;

    if (text.includes('medical') || text.includes('health') || text.includes('cancer') || text.includes('treatment')) {
      return 'theme-health';
    } else if (text.includes('environment') || text.includes('coral') || text.includes('forest') || text.includes('nature')) {
      return 'theme-nature';
    } else if (text.includes('ai') || text.includes('technology') || text.includes('innovation') || text.includes('breakthrough')) {
      return 'theme-innovation';
    } else if (text.includes('community') || text.includes('volunteer') || text.includes('together') || text.includes('support')) {
      return 'theme-community';
    } else if (text.includes('education') || text.includes('learning') || text.includes('school') || text.includes('literacy')) {
      return 'theme-education';
    } else {
      return 'theme-hope';
    }
  };

  // Auto transition effect
  useEffect(() => {
    if (!stories || stories.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % stories.length);
        setIsTransitioning(false);
      }, 300);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [stories, isPaused]);

  // Update body theme when story changes
  useEffect(() => {
    if (stories && stories[currentIndex]) {
      const theme = getThemeFromStory(stories[currentIndex]);
      document.body.className = theme;
    }
  }, [currentIndex, stories]);

  // Navigation functions
  const goToPrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
      setIsTransitioning(false);
    }, 300);
  };

  // Generate random inspiring image based on story content
  const getStoryImage = (story) => {
    const images = {
      health: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      innovation: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
      community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
      education: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      hope: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      science: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      celebration: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
    };

    const theme = getThemeFromStory(story);
    switch (theme) {
      case 'theme-health': return images.health;
      case 'theme-nature': return images.nature;
      case 'theme-innovation': return images.innovation;
      case 'theme-community': return images.community;
      case 'theme-education': return images.education;
      default: return images.hope;
    }
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
            onClick={() => setCurrentIndex(index)}
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
          Previous
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
          Next
          <span>▶</span>
        </button>
      </div>
    </div>
  );
};

export default NewsDisplay;
