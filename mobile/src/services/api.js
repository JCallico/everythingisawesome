import axios from 'axios';
import { createImageService, createApiService } from '@everythingisawesome/shared-api';
import Constants from 'expo-constants';

// Centralized API configuration using Expo app.json extra
const getApiBaseUrl = () => {
  const { apiBaseUrlDev, apiBaseUrlProd } = Constants.expoConfig.extra;
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return apiBaseUrlDev;
  }
  return apiBaseUrlProd;
};

const getImageBaseUrl = () => {
  const { imageBaseUrlDev, imageBaseUrlProd } = Constants.expoConfig.extra;
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return imageBaseUrlDev;
  }
  return imageBaseUrlProd;
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
