import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { fetchNewsByDate, fetchAvailableDates } from '../services/api';
import NewsDisplay from './NewsDisplay';

const NewsPage = () => {
  const { date, storyIndex } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  // Parse story index from URL parameter (convert from 1-based to 0-based)
  const currentStoryIndex = storyIndex ? parseInt(storyIndex, 10) - 1 : 0;
  
  // Check if story index is valid (will be validated after news loads)
  const isValidStoryIndex = (stories, index) => {
    return stories && Array.isArray(stories) && index >= 0 && index < stories.length;
  };

  const loadNews = useCallback(async () => {
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
    loadNews();
    loadAvailableDates();
  }, [loadNews, loadAvailableDates]);

  const getNavigationInfo = () => {
    if (!availableDates.length) return { prevDate: null, nextDate: null };
    
    const currentIndex = availableDates.indexOf(date);
    
    return {
      prevDate: currentIndex < availableDates.length - 1 ? availableDates[currentIndex + 1] : null,
      nextDate: currentIndex > 0 ? availableDates[currentIndex - 1] : null
    };
  };

  if (loading) {
    return (
      <div className="news-container">
        <div className="loading">Loading news for {moment(date).format('MMMM Do, YYYY')}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container">
        <div className="error">{error}</div>
        <div className="navigation">
          <Link to="/" className="nav-button">
            Back to Latest News
          </Link>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-container">
        <div className="error">No news found for this date.</div>
        <div className="navigation">
          <Link to="/" className="nav-button">
            Back to Latest News
          </Link>
        </div>
      </div>
    );
  }

  const { prevDate, nextDate } = getNavigationInfo();

  return (
    <div className="news-container">
      <div className="news-date">
        <h2>{news.title}</h2>
      </div>

      <NewsDisplay 
        stories={news.stories} 
        initialStoryIndex={currentStoryIndex}
        date={date}
      />

      <div className="navigation">
        <Link to="/" className="nav-button">
          Latest News
        </Link>
        
        {prevDate && (
          <Link to={`/${prevDate}`} className="nav-button">
            ← Previous Day ({moment(prevDate).format('MMM Do')})
          </Link>
        )}
        
        {nextDate && (
          <Link to={`/${nextDate}`} className="nav-button">
            Next Day ({moment(nextDate).format('MMM Do')}) →
          </Link>
        )}
      </div>

      {availableDates.length > 1 && (
        <div className="date-selector">
          {availableDates.slice(0, 9).map(dateOption => (
            <Link
              key={dateOption}
              to={dateOption === date ? `/${dateOption}` : (availableDates[0] === dateOption ? '/' : `/${dateOption}`)}
              className={`date-option ${dateOption === date ? 'active' : ''}`}
            >
              {moment(dateOption).format('MMM Do')}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
