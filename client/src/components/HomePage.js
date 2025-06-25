import React, { useState, useEffect } from 'react';
import { fetchLatestNews, fetchAvailableDates } from '../services/api';
import NewsDisplay from './NewsDisplay';
import DateSelector from './DateSelector';

const HomePage = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [showDateSelector, setShowDateSelector] = useState(false);

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

  return (
    <div className="news-container">
      <div className="news-date">
        <h2>{news.title}</h2>
      </div>

      <NewsDisplay 
        stories={news.stories} 
        initialStoryIndex={0}
        date={news.date}
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
        currentDate={news?.date}
      />
    </div>
  );
};

export default HomePage;
