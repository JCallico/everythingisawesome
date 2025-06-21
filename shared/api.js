import axios from 'axios';

// Platform-agnostic API configuration
const createApiConfig = (baseUrl) => ({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoint definitions
export const API_ENDPOINTS = {
  NEWS_LATEST: '/news/latest',
  NEWS_BY_DATE: '/news',
  NEWS_DATES: '/news/dates',
  IMAGES: '/images',
};

// Shared API functions that work on both web and mobile
export const createApiService = (baseUrl, imageBaseUrl) => {
  const api = axios.create(createApiConfig(baseUrl));

  return {
    fetchLatestNews: async () => {
      try {
        const response = await api.get(API_ENDPOINTS.NEWS_LATEST);
        return response.data;
      } catch (error) {
        console.error('Error fetching latest news:', error);
        throw new Error('Failed to fetch latest news');
      }
    },

    fetchNewsByDate: async (date) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.NEWS_BY_DATE}/${date}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching news by date:', error);
        throw new Error('Failed to fetch news by date');
      }
    },

    fetchAvailableDates: async () => {
      try {
        const response = await api.get(API_ENDPOINTS.NEWS_DATES);
        return response.data;
      } catch (error) {
        console.error('Error fetching available dates:', error);
        throw new Error('Failed to fetch available dates');
      }
    },

    resolveImageUrl: (imagePath) => {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      return `${imageBaseUrl}${imagePath}`;
    },
  };
};

export default createApiService;
