import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { fetchLatestNews, fetchAvailableDates, fetchNewsByDate } from '../services/api';
import NewsDisplay from './NewsDisplay';
import DateSelector from './DateSelector';

const HomePage = () => {
  // Support both latest news and date-specific news via URL params
  const { date, storyIndex } = useParams();
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [showDateSelector, setShowDateSelector] = useState(false);

  // Parse story index from URL parameter (convert from 1-based to 0-based)
  const currentStoryIndex = storyIndex ? parseInt(storyIndex, 10) - 1 : 0;
  
  // Check if story index is valid (will be validated after news loads)
  const isValidStoryIndex = (stories, index) => {
    return stories && Array.isArray(stories) && index >= 0 && index < stories.length;
  };

  const loadLatestNews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLatestNews();
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load latest news. Please try again later.');
      console.error('Error loading latest news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNewsForDate = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchNewsByDate(date);
      
      // Check if the story index is valid
      if (storyIndex && !isValidStoryIndex(data.stories, currentStoryIndex)) {
        setError('Failed to load news for this date. Please try another date.');
        setNews(null);
      } else {
        setNews(data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load news for this date. Please try another date.');
      setNews(null);
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  }, [date, storyIndex, currentStoryIndex]);

  const loadAvailableDates = useCallback(async () => {
    try {
      const dates = await fetchAvailableDates();
      setAvailableDates(dates);
    } catch (err) {
      console.error('Error loading available dates:', err);
    }
  }, []);

  useEffect(() => {
    // Load news based on URL parameter or latest
    if (date) {
      loadNewsForDate();
    } else {
      loadLatestNews();
    }
    loadAvailableDates();
  }, [date, storyIndex, loadNewsForDate, loadLatestNews, loadAvailableDates]);

  if (loading) {
    const loadingMessage = date 
      ? `Loading news for ${moment(date).format('MMMM Do, YYYY')}...`
      : 'Loading the latest awesome news...';
    
    return (
      <div className="news-container">
        <div className="loading">{loadingMessage}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container">
        <div className="error">{error}</div>
        <div className="navigation">
          {date ? (
            <Link to="/" className="nav-button">
              Back to Latest News
            </Link>
          ) : (
            <button className="nav-button" onClick={loadLatestNews}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!news) {
    const noNewsMessage = date 
      ? 'No news found for this date.'
      : 'No news available yet. Check back later!';
    
    return (
      <div className="news-container">
        <div className="error">{noNewsMessage}</div>
        {date && (
          <div className="navigation">
            <Link to="/" className="nav-button">
              Back to Latest News
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="news-container">
      <div className="news-date">
        <h2>{news.title}</h2>
      </div>

      <NewsDisplay 
        stories={news.stories} 
        initialStoryIndex={currentStoryIndex}
        date={date || news.date}
      />

      <div className="navigation">
        <button 
          className="nav-button"
          onClick={() => setShowDateSelector(true)}
        >
          Browse Dates
        </button>
      </div>

      <DateSelector
        visible={showDateSelector}
        onClose={() => setShowDateSelector(false)}
        availableDates={availableDates}
        currentDate={date || news?.date}
      />
    </div>
  );
};

export default HomePage;
