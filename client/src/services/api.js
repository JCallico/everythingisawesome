import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
