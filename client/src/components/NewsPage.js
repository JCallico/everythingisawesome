import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { fetchNewsByDate, fetchAvailableDates } from '../services/api';
import NewsDisplay from './NewsDisplay';

const NewsPage = () => {
  const { date } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    loadNews();
    loadAvailableDates();
  }, [date]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await fetchNewsByDate(date);
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load news for this date. Please try another date.');
      console.error('Error loading news:', err);
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

      <NewsDisplay stories={news.stories} />

      <div className="navigation">
        <Link to="/" className="nav-button">
          Latest News
        </Link>
        
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
          {availableDates.slice(0, 7).map(dateOption => (
            <Link
              key={dateOption}
              to={dateOption === date ? `/date/${dateOption}` : (availableDates[0] === dateOption ? '/' : `/date/${dateOption}`)}
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
