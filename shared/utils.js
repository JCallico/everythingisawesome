import moment from 'moment';

// Theme definitions shared between web and mobile
export const THEMES = {
  hope: {
    name: 'Hope',
    primary: '#4A90E2',
    secondary: '#7BB3F0',
    accent: '#FFD700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#FFFFFF',
  },
  innovation: {
    name: 'Innovation',
    primary: '#9B59B6',
    secondary: '#C39BD3',
    accent: '#F39C12',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#FFFFFF',
  },
  nature: {
    name: 'Nature',
    primary: '#27AE60',
    secondary: '#58D68D',
    accent: '#F4D03F',
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    textColor: '#FFFFFF',
  },
  community: {
    name: 'Community',
    primary: '#E74C3C',
    secondary: '#F1948A',
    accent: '#F7DC6F',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#FFFFFF',
  },
  // Add more themes as needed
};

// Utility functions for date handling
export const dateUtils = {
  formatDate: (date, format = 'YYYY-MM-DD') => {
    return moment(date).format(format);
  },

  formatDisplayDate: (dateString) => {
    return moment(dateString).format('MMMM Do, YYYY');
  },

  isValidDate: (dateString) => {
    return moment(dateString, 'YYYY-MM-DD', true).isValid();
  },

  sortDatesDescending: (dates) => {
    return dates.sort((a, b) => moment(b).diff(moment(a)));
  },

  getRelativeTime: (dateString) => {
    return moment(dateString).fromNow();
  },
};

// Story processing utilities
export const storyUtils = {
  getThemeFromStory: (story) => {
    return story.theme || 'hope';
  },

  validateStory: (story) => {
    return (
      story &&
      story.title &&
      story.summary &&
      story.link &&
      typeof story.awesome_index === 'number'
    );
  },

  sortStoriesByAwesomeIndex: (stories) => {
    return [...stories].sort((a, b) => b.awesome_index - a.awesome_index);
  },

  getStoryExcerpt: (summary, maxLength = 150) => {
    if (!summary || summary.length <= maxLength) return summary;
    return summary.substring(0, maxLength).trim() + '...';
  },
};

// Platform detection utilities
export const platformUtils = {
  isWeb: () => typeof window !== 'undefined' && window.document,
  isMobile: () => typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  isReactNative: () => typeof navigator !== 'undefined' && navigator.product === 'ReactNative',
};

// Constants shared across platforms
export const CONSTANTS = {
  AUTO_ROTATION_INTERVAL: 30000, // 30 seconds
  ANIMATION_DURATION: 300,
  THEMES_LIST: Object.keys(THEMES),
  DEFAULT_THEME: 'hope',
  MAX_STORIES_PER_DAY: 10,
};

export default {
  THEMES,
  dateUtils,
  storyUtils,
  platformUtils,
  CONSTANTS,
};
