/**
 * Shared API configuration utilities
 * These are pure utility functions that can be used by both web and mobile apps
 * Environment-specific logic should be implemented in the consuming apps
 */

/**
 * Factory function to create image utility functions with a configured base URL
 * @param {string} baseUrl - The base URL for resolving relative image paths
 * @returns {object} Image utility functions
 */
export const createImageService = (baseUrl = '') => {
  return {
    resolveImageUrl: (imagePath) => {
      // If the path is already absolute (starts with http), return as is
      if (imagePath && imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // For relative paths, prepend the base URL
      if (imagePath && imagePath.startsWith('/')) {
        return `${baseUrl}${imagePath}`;
      }
      
      return imagePath;
    }
  };
};

/**
 * Factory function to create API service functions with a configured axios instance
 * @param {object} apiInstance - Configured axios instance
 * @returns {object} API service functions
 */
export const createApiService = (apiInstance) => {
  return {
    fetchLatestNews: async () => {
      try {
        const response = await apiInstance.get('/news/latest');
        return response.data;
      } catch (error) {
        console.error('Error fetching latest news:', error);
        throw new Error('Failed to fetch latest news');
      }
    },

    fetchNewsByDate: async (date) => {
      try {
        const response = await apiInstance.get(`/news/date/${date}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching news for date ${date}:`, error);
        throw new Error(`Failed to fetch news for ${date}`);
      }
    },

    fetchAvailableDates: async () => {
      try {
        const response = await apiInstance.get('/news/dates');
        return response.data;
      } catch (error) {
        console.error('Error fetching available dates:', error);
        throw new Error('Failed to fetch available dates');
      }
    }
  };
};
