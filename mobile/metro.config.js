const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro config
const config = getDefaultConfig(__dirname);

// Add the monorepo packages to the watchFolders
config.watchFolders = [
  ...config.watchFolders,
  // Add the packages directory to watch folders
  path.resolve(__dirname, '../packages'),
];

// Configure resolver to handle symlinked packages
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../node_modules'),
];

// Ensure Metro can resolve the shared packages
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
