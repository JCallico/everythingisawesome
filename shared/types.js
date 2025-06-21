// TypeScript-style interfaces/types for shared data structures
// Can be used with JSDoc comments for type checking in JavaScript

/**
 * @typedef {Object} NewsStory
 * @property {string} title - The story title
 * @property {string} summary - The story summary
 * @property {string} link - The original news article URL
 * @property {number} awesome_index - Positivity score (0-100)
 * @property {string} image - Path to the generated image
 * @property {string} theme - Theme identifier for styling
 */

/**
 * @typedef {Object} NewsData
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {string} title - Daily collection title
 * @property {NewsStory[]} stories - Array of news stories
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {*} data - Response data
 * @property {string} [message] - Error or status message
 */

/**
 * @typedef {Object} NavigationParams
 * @property {string} [date] - Date parameter for navigation
 * @property {number} [storyIndex] - Story index for deep linking
 */

/**
 * @typedef {Object} ThemeConfig
 * @property {string} name - Theme display name
 * @property {string} primary - Primary color
 * @property {string} secondary - Secondary color
 * @property {string} accent - Accent color
 * @property {string} background - Background gradient or color
 * @property {string} textColor - Text color
 */

// Export types for use in both web and mobile
export const Types = {
  NewsStory: 'NewsStory',
  NewsData: 'NewsData',
  ApiResponse: 'ApiResponse',
  NavigationParams: 'NavigationParams',
  ThemeConfig: 'ThemeConfig',
};

export default Types;
