/**
 * Shared API configuration utilities
 * These are pure utility functions that can be used by both web and mobile apps
 * Environment-specific logic should be implemented in the consuming apps
 */

/**
 * Utility function to resolve image URLs correctly
 * @param {string} imagePath - The relative or absolute image path
 * @param {string} baseUrl - The base URL to prepend to relative paths
 * @returns {string} The resolved image URL
 */
export const resolveImageUrl = (imagePath, baseUrl = '') => {
  // If the path is already absolute (starts with http), return as is
  if (imagePath && imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For relative paths, prepend the base URL
  if (imagePath && imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  return imagePath;
};
