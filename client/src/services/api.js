import axios from 'axios';
import { createImageService, createApiService } from '@everythingisawesome/shared-api';

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

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Create API service functions using the shared factory
const apiService = createApiService(api);

// Create image service functions using the shared factory
const imageService = createImageService(getImageBaseUrl());

// Export the API functions directly from the shared service
export const { fetchLatestNews, fetchNewsByDate, fetchAvailableDates } = apiService;

// Export the image functions directly from the shared service
export const { resolveImageUrl } = imageService;

// Export the environment-specific functions
export { getApiBaseUrl, getImageBaseUrl };

export default api;
