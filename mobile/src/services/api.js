import axios from 'axios';
import { createImageService, createApiService } from '@everythingisawesome/shared-api';

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

// Create API service functions using the shared factory
const apiService = createApiService(api);

// Create image service functions using the shared factory
const imageService = createImageService(getImageBaseUrl());

// Export the API functions directly from the shared service
export const { fetchLatestNews, fetchNewsByDate, fetchAvailableDates } = apiService;

// Export the image functions directly from the shared service
export const { resolveImageUrl } = imageService;

// Re-export the shared functions
export { getApiBaseUrl, getImageBaseUrl };

export default api;
