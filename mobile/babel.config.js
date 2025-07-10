module.exports = function(api) {
  api.cache(true);
  
  // Function to safely check if a plugin exists
  const getOptionalPlugins = () => {
    const plugins = [];
    
    // Only add reanimated plugin if it's installed and not in test environment
    if (process.env.NODE_ENV !== 'test') {
      try {
        require.resolve('react-native-reanimated/plugin');
        plugins.push('react-native-reanimated/plugin');
      } catch (error) {
        // Plugin not found, skip it
        console.log('react-native-reanimated/plugin not found, skipping...', error.message);
      }
    }
    
    return plugins;
  };

  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      ...getOptionalPlugins()
    ],
    env: {
      test: {
        presets: [
          'babel-preset-expo',
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-react'
        ],
        plugins: [
          '@babel/plugin-transform-modules-commonjs'
        ]
      }
    }
  };
};
