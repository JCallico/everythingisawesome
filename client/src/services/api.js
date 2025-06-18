import axios from 'axios';

// Determine the correct API base URL based on environment
const getApiBaseUrl = () => {
  // If REACT_APP_API_URL is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In development, explicitly use localhost:3001
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api';
  }
  
  // In production, use relative URLs
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchLatestNews = async () => {
  try {
    const response = await api.get('/news/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    throw new Error('Failed to fetch latest news');
  }
};

export const fetchNewsByDate = async (date) => {
  try {
    const response = await api.get(`/news/date/${date}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news for date ${date}:`, error);
    throw new Error(`Failed to fetch news for ${date}`);
  }
};

export const fetchAvailableDates = async () => {
  try {
    const response = await api.get('/news/dates');
    return response.data;
  } catch (error) {
    console.error('Error fetching available dates:', error);
    throw new Error('Failed to fetch available dates');
  }
};

export default api;
