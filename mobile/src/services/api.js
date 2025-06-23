import axios from 'axios';
import { resolveImageUrl } from '@everythingisawesome/shared-api';

// Mobile-specific API configuration
const getApiBaseUrl = () => {
  // Check for React Native development environment
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'http://localhost:3001/api';
  }
  
  // For mobile production, use the full Azure website URL
  return 'https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/api';
};

const getImageBaseUrl = () => {
  // Check for React Native development environment
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'http://localhost:3001';
  }
  
  // For mobile production, use the full Azure website URL
  return 'https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net';
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

// Re-export the shared functions
export { getApiBaseUrl, getImageBaseUrl, resolveImageUrl };

export default api;
