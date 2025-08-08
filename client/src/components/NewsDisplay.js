import React, { useState, useEffect, useCallback, useRef } from 'react';
import { resolveImageUrl } from '../services/api';

const NewsDisplay = ({ stories, initialStoryIndex = 0, date }) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserActive, setIsUserActive] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageCropped, setImageCropped] = useState(false);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const [maxPanOffset, setMaxPanOffset] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const panIntervalRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const userActivityTimeoutRef = useRef(null);
  const isUserActiveRef = useRef(false);

  // Calculate actual pixel offsets needed for panning
  const calculatePanOffsets = useCallback(() => {
    if (!imageRef.current || !containerRef.current || !imageNaturalSize.width) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Calculate displayed image dimensions based on object-fit: cover
    const containerAspectRatio = containerWidth / containerHeight;
    const imageAspectRatio = imageNaturalSize.width / imageNaturalSize.height;

    let displayedImageWidth, displayedImageHeight;
    let maxX = 0;
    let maxY = 0;

    if (containerAspectRatio > imageAspectRatio) {
      // Container is wider - image fills container width, height extends beyond
      displayedImageWidth = containerWidth;
      displayedImageHeight = containerWidth / imageAspectRatio;
      // maxY = IH - CH (using your formula)
      maxY = Math.max(0, displayedImageHeight - containerHeight);
    } else {
      // Container is taller - image fills container height, width extends beyond  
      displayedImageHeight = containerHeight;
      displayedImageWidth = containerHeight * imageAspectRatio;
      // maxX = IW - CW (same principle horizontally)
      maxX = Math.max(0, displayedImageWidth - containerWidth);
    }

    setMaxPanOffset({ x: maxX, y: maxY });
    setImageCropped(maxX > 5 || maxY > 5); // Consider cropped if overflow > 5px
  }, [imageNaturalSize]);

  // Handle user activity detection
  const handleUserActivity = useCallback(() => {
    setIsUserActive(true);
    isUserActiveRef.current = true;
    
    // Immediately freeze the image at its current position
    if (imageRef.current) {
      const computedStyle = window.getComputedStyle(imageRef.current);
      const transform = computedStyle.transform;
      
      // Extract current position from transform matrix
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        setImagePosition({ x: matrix.m41, y: matrix.m42 });
      }
    }
    
    // Clear existing timeout
    if (userActivityTimeoutRef.current) {
      clearTimeout(userActivityTimeoutRef.current);
    }
    
    // Set timeout to resume panning after 2 seconds of inactivity
    userActivityTimeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
      isUserActiveRef.current = false;
    }, 2000);
  }, []);

  // Get theme from story data (pre-calculated during news fetching)
  const getThemeFromStory = (story) => {
    // Simply return the theme from the story data (all stories now have themes)
    return story.theme || 'hope'; // Fallback to 'hope' if somehow missing
  };

  // Check if image is cropped and determine panning direction
  const checkImageCropping = useCallback(() => {
    if (!imageRef.current || !containerRef.current || !imageNaturalSize.width) return;

    const container = containerRef.current;
    const containerAspectRatio = container.offsetWidth / container.offsetHeight;
    const imageAspectRatio = imageNaturalSize.width / imageNaturalSize.height;

    // Determine what type of cropping is happening
    const aspectRatioDiff = Math.abs(containerAspectRatio - imageAspectRatio);
    const isCropped = aspectRatioDiff > 0.05;
    
    setImageCropped(isCropped);
  }, [imageNaturalSize]);

  // Handle image load to get natural dimensions and calculate offsets
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      setImageNaturalSize({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      setIsImageLoaded(true);
      // Calculate pan offsets will be called by useEffect when imageNaturalSize changes
    }
  }, []);

  // Set up resize observer to recalculate offsets when container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      // Debounce the calculation to avoid excessive calls during resize
      setTimeout(() => {
        calculatePanOffsets();
        // Reset image position when container resizes
        setImagePosition({ x: 0, y: 0 });
        // Stop any current panning - restart will be handled by the image loaded effect
        if (panIntervalRef.current) {
          clearInterval(panIntervalRef.current);
          panIntervalRef.current = null;
        }
      }, 50);
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [calculatePanOffsets]);

  // Calculate offsets when image loads or dimensions change
  useEffect(() => {
    calculatePanOffsets();
  }, [imageNaturalSize, calculatePanOffsets]);

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
      return resolveImageUrl(story.image);
    }
    
    // Fallback to themed local images based on story theme (pre-calculated)
    const theme = story.theme || 'hope';
    return resolveImageUrl(`/generated-images/fallback-${theme}.png`);
  };

  // Simple auto-pan using actual pixel coordinates
  const startAutoPan = useCallback(() => {
    if (!isImageLoaded || !imageCropped || (!maxPanOffset.x && !maxPanOffset.y)) return;
    
    let panPositions;
    
    if (maxPanOffset.y > 0) {
      // Can pan vertically - following your algorithm: y = 0 to y = IH - CH
      // CSS transforms: move image UP (negative) to show bottom content
      panPositions = [
        { x: 0, y: 0 },                     // y = 0: Show top of image
        { x: 0, y: -maxPanOffset.y / 2 },   // y = (IH-CH)/2: Show middle
        { x: 0, y: -maxPanOffset.y },       // y = IH-CH: Show bottom (kitten!)
      ];
    } else if (maxPanOffset.x > 0) {
      // Can pan horizontally - same principle: x = 0 to x = IW - CW
      // CSS transforms: move image LEFT (negative) to show right content
      panPositions = [
        { x: 0, y: 0 },                     // x = 0: Show left of image
        { x: -maxPanOffset.x / 2, y: 0 },   // x = (IW-CW)/2: Show middle
        { x: -maxPanOffset.x, y: 0 },       // x = IW-CW: Show right side
      ];
    } else {
      // No panning needed
      panPositions = [{ x: 0, y: 0 }];
    }
    
    let currentPanIndex = 0;
    
    const panFunction = () => {
      // Check if user is active before panning using ref (always current value)
      if (!isUserActiveRef.current) {
        setImagePosition(panPositions[currentPanIndex]);
        currentPanIndex = (currentPanIndex + 1) % panPositions.length;
      }
    };
    
    // Run immediately first
    panFunction();
    
    // Then set up interval
    panIntervalRef.current = setInterval(panFunction, 12000); // Change every 12 seconds (slower, allows 8s transition + 4s pause)
    
  }, [isImageLoaded, imageCropped, maxPanOffset]);

  const stopAutoPan = useCallback(() => {
    if (panIntervalRef.current) {
      clearInterval(panIntervalRef.current);
      panIntervalRef.current = null;
    }
  }, []);

  // Reset image position when story changes
  useEffect(() => {
    setImagePosition({ x: 0, y: 0 });
    setIsImageLoaded(false);
    setImageCropped(false);
    setImageNaturalSize({ width: 0, height: 0 });
    stopAutoPan();
  }, [currentIndex, stopAutoPan]);

  // Start auto-pan as soon as image loads
  useEffect(() => {
    if (isImageLoaded) {
      // Start immediately when image is visible
      const timeout = setTimeout(() => {
        startAutoPan();
      }, 500); // Short delay to let image settle
      
      return () => clearTimeout(timeout);
    } else {
      stopAutoPan();
    }
  }, [isImageLoaded, startAutoPan, stopAutoPan]);

  // Set up mouse and scroll event listeners to detect user activity
  useEffect(() => {
    const events = ['mousemove', 'scroll', 'touchstart', 'touchmove'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (userActivityTimeoutRef.current) {
        clearTimeout(userActivityTimeoutRef.current);
      }
    };
  }, [handleUserActivity]);

  // Restart panning when user activity changes
  useEffect(() => {
    if (isImageLoaded && imageCropped) {
      // Only restart if there's no interval running
      if (!panIntervalRef.current) {
        startAutoPan();
      }
      // The interval itself will handle pausing based on isUserActive
    }
  }, [isImageLoaded, imageCropped, startAutoPan]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoPan();
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (userActivityTimeoutRef.current) {
        clearTimeout(userActivityTimeoutRef.current);
      }
    };
  }, [stopAutoPan]);

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

        <div 
          className="story-image-container"
          ref={containerRef}
        >
          <img
            ref={imageRef}
            src={getStoryImage(currentStory)}
            alt={currentStory.title}
            className="story-image"
            style={{
              transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)`,
              transition: isUserActive ? 'none' : undefined
            }}
            onLoad={handleImageLoad}
            onError={() => setIsImageLoaded(false)}
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
