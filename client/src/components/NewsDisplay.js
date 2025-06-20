import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../services/api';

const NewsDisplay = ({ stories, initialStoryIndex = 0, date }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Color themes based on story content
  const getThemeFromStory = (story) => {
    const title = story.title.toLowerCase();
    const summary = story.summary.toLowerCase();
    const text = title + ' ' + summary;

    // Medical and health-related
    if (text.includes('medical') || text.includes('health') || text.includes('cancer') || 
        text.includes('treatment') || text.includes('hospital') || text.includes('doctor') || 
        text.includes('medicine') || text.includes('vaccine')) {
      return 'theme-health';
    }
    // Environment and nature
    else if (text.includes('environment') || text.includes('coral') || text.includes('forest') || 
             text.includes('nature') || text.includes('climate') || text.includes('wildlife') || 
             text.includes('ocean') || text.includes('green') || text.includes('sustainability')) {
      return 'theme-nature';
    }
    // Technology and innovation
    else if (text.includes('ai') || text.includes('technology') || text.includes('innovation') || 
             text.includes('breakthrough') || text.includes('robot') || text.includes('digital') || 
             text.includes('software') || text.includes('internet') || text.includes('computer')) {
      return 'theme-innovation';
    }
    // Community and social
    else if (text.includes('community') || text.includes('volunteer') || text.includes('together') || 
             text.includes('support') || text.includes('charity') || text.includes('help') || 
             text.includes('donate') || text.includes('social')) {
      return 'theme-community';
    }
    // Education and learning
    else if (text.includes('education') || text.includes('learning') || text.includes('school') || 
             text.includes('literacy') || text.includes('student') || text.includes('university') || 
             text.includes('teaching') || text.includes('academic')) {
      return 'theme-education';
    }
    // Sports and fitness
    else if (text.includes('sport') || text.includes('game') || text.includes('team') || 
             text.includes('player') || text.includes('championship') || text.includes('olympic') || 
             text.includes('fitness') || text.includes('athlete') || text.includes('competition')) {
      return 'theme-sports';
    }
    // Science and research
    else if (text.includes('science') || text.includes('research') || text.includes('study') || 
             text.includes('discovery') || text.includes('experiment') || text.includes('laboratory') || 
             text.includes('scientist') || text.includes('physics') || text.includes('chemistry')) {
      return 'theme-science';
    }
    // Arts and culture
    else if (text.includes('art') || text.includes('music') || text.includes('film') || 
             text.includes('culture') || text.includes('museum') || text.includes('artist') || 
             text.includes('creative') || text.includes('design') || text.includes('theater')) {
      return 'theme-arts';
    }
    // Business and finance
    else if (text.includes('business') || text.includes('company') || text.includes('startup') || 
             text.includes('finance') || text.includes('investment') || text.includes('market') || 
             text.includes('economic') || text.includes('profit') || text.includes('trade')) {
      return 'theme-business';
    }
    // Entertainment
    else if (text.includes('entertainment') || text.includes('celebrity') || text.includes('movie') || 
             text.includes('show') || text.includes('concert') || text.includes('festival') || 
             text.includes('performance') || text.includes('comedy')) {
      return 'theme-entertainment';
    }
    // Travel and adventure
    else if (text.includes('travel') || text.includes('tourism') || text.includes('vacation') || 
             text.includes('adventure') || text.includes('journey') || text.includes('destination') || 
             text.includes('explore') || text.includes('trip')) {
      return 'theme-travel';
    }
    // Food and cooking
    else if (text.includes('food') || text.includes('restaurant') || text.includes('cooking') || 
             text.includes('recipe') || text.includes('chef') || text.includes('cuisine') || 
             text.includes('dining') || text.includes('meal')) {
      return 'theme-food';
    }
    // Lifestyle and wellness
    else if (text.includes('lifestyle') || text.includes('wellness') || text.includes('beauty') || 
             text.includes('fashion') || text.includes('home') || text.includes('family') || 
             text.includes('relationship') || text.includes('personal')) {
      return 'theme-lifestyle';
    }
    // Politics and government
    else if (text.includes('politics') || text.includes('government') || text.includes('election') || 
             text.includes('policy') || text.includes('law') || text.includes('congress') || 
             text.includes('president') || text.includes('vote')) {
      return 'theme-politics';
    }
    // Economy and finance news
    else if (text.includes('economy') || text.includes('inflation') || text.includes('gdp') || 
             text.includes('unemployment') || text.includes('banking') || text.includes('currency') || 
             text.includes('stock') || text.includes('financial')) {
      return 'theme-economy';
    }
    // World and international news
    else if (text.includes('world') || text.includes('international') || text.includes('global') || 
             text.includes('country') || text.includes('nation') || text.includes('diplomatic') || 
             text.includes('foreign') || text.includes('border')) {
      return 'theme-world';
    }
    // Inspiring and uplifting stories
    else if (text.includes('inspiring') || text.includes('amazing') || text.includes('incredible') || 
             text.includes('wonderful') || text.includes('uplifting') || text.includes('positive') || 
             text.includes('heartwarming') || text.includes('triumph')) {
      return 'theme-inspiring';
    }
    // Default hope theme for everything else
    else {
      return 'theme-hope';
    }
  };

  // Sync current index with URL parameter
  useEffect(() => {
    if (stories && stories.length > 0) {
      const validIndex = Math.max(0, Math.min(initialStoryIndex, stories.length - 1));
      setCurrentIndex(validIndex);
    }
  }, [initialStoryIndex, stories]);

  // Function to update URL when story changes (convert from 0-based to 1-based)
  const updateURL = (newIndex) => {
    if (newIndex === 0) {
      // For first story, use the cleaner URL without story index
      navigate(`/${date}`, { replace: true });
    } else {
      // Convert 0-based index to 1-based for URL
      navigate(`/${date}/${newIndex + 1}`, { replace: true });
    }
  };

  // Auto transition effect
  useEffect(() => {
    if (!stories || stories.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        const newIndex = (currentIndex + 1) % stories.length;
        setCurrentIndex(newIndex);
        updateURL(newIndex);
        setIsTransitioning(false);
      }, 300);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [stories, isPaused, currentIndex]);

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
      const newIndex = (currentIndex - 1 + stories.length) % stories.length;
      setCurrentIndex(newIndex);
      updateURL(newIndex);
      setIsTransitioning(false);
    }, 300);
  };

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const newIndex = (currentIndex + 1) % stories.length;
      setCurrentIndex(newIndex);
      updateURL(newIndex);
      setIsTransitioning(false);
    }, 300);
  };

  const goToStory = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      updateURL(index);
      setIsTransitioning(false);
    }, 300);
  };

  // Generate image URL from story data or fallback to themed local image
  const getStoryImage = (story) => {
    // Use the image from the story data if available
    if (story.image && story.image !== 'placeholder') {
      return resolveImageUrl(story.image);
    }
    
    // Fallback to themed local images based on story content
    const theme = getThemeFromStory(story);
    const themeMap = {
      'theme-health': 'medical',
      'theme-nature': 'environment',
      'theme-innovation': 'technology',
      'theme-community': 'community',
      'theme-education': 'education',
      'theme-science': 'science',
      'theme-sports': 'sports',
      'theme-arts': 'arts'
    };
    
    const fallbackTheme = themeMap[theme] || 'general';
    return resolveImageUrl(`/generated-images/fallback-${fallbackTheme}.png`);
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
