import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { fetchLatestNews, fetchAvailableDates } from '../services/api';
import NewsDisplay from './NewsDisplay';

const HomePage = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    loadLatestNews();
    loadAvailableDates();
  }, []);

  const loadLatestNews = async () => {
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
  };

  const loadAvailableDates = async () => {
    try {
      const dates = await fetchAvailableDates();
      setAvailableDates(dates);
    } catch (err) {
      console.error('Error loading available dates:', err);
    }
  };

  const getNavigationInfo = () => {
    if (!news || !availableDates.length) return { prevDate: null, nextDate: null };
    
    const currentDate = news.date;
    const currentIndex = availableDates.indexOf(currentDate);
    
    return {
      prevDate: currentIndex < availableDates.length - 1 ? availableDates[currentIndex + 1] : null,
      nextDate: currentIndex > 0 ? availableDates[currentIndex - 1] : null
    };
  };

  if (loading) {
    return (
      <div className="news-container">
        <div className="loading">Loading the latest awesome news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container">
        <div className="error">{error}</div>
        <div className="navigation">
          <button className="nav-button" onClick={loadLatestNews}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-container">
        <div className="error">No news available yet. Check back later!</div>
      </div>
    );
  }

  const { prevDate, nextDate } = getNavigationInfo();

  return (
    <div className="news-container">
      <div className="news-date">
        <h2>{news.title}</h2>
      </div>

      <NewsDisplay stories={news.stories} />

      <div className="navigation">
        {prevDate && (
          <Link to={`/date/${prevDate}`} className="nav-button">
            ← Previous Day ({moment(prevDate).format('MMM Do')})
          </Link>
        )}
        
        {nextDate && (
          <Link to={`/date/${nextDate}`} className="nav-button">
            Next Day ({moment(nextDate).format('MMM Do')}) →
          </Link>
        )}
      </div>

      {availableDates.length > 1 && (
        <div className="date-selector">
          {availableDates.slice(0, 7).map(date => (
            <Link
              key={date}
              to={date === news.date ? '/' : `/date/${date}`}
              className={`date-option ${date === news.date ? 'active' : ''}`}
            >
              {moment(date).format('MMM Do')}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
