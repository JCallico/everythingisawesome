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

// Determine the correct base URL for images
const getImageBaseUrl = () => {
  // If REACT_APP_API_URL is set, use it (removing /api from the end)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace('/api', '');
  }
  
  // In development, explicitly use localhost:3001
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // In production, use relative URLs (no base URL needed)
  return '';
};

const API_BASE_URL = getApiBaseUrl();
const IMAGE_BASE_URL = getImageBaseUrl();

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

// Utility function to resolve image URLs correctly for different environments
export const resolveImageUrl = (imagePath) => {
  // If the path is already absolute (starts with http), return as is
  if (imagePath && imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For relative paths, prepend the image base URL
  if (imagePath && imagePath.startsWith('/')) {
    return `${IMAGE_BASE_URL}${imagePath}`;
  }
  
  return imagePath;
};

export default api;
