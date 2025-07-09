module.exports = {
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all'
  ],
  plugins: [
    'react',
    'react-native'
  ],
  env: {
    'react-native/react-native': true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    // React Native specific rules
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'off', // Allow raw text in React Native
    
    // React rules
    'react/prop-types': 'off', // We're not using PropTypes
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    
    // General JavaScript rules
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Code style
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always']
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
