const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');

module.exports = [
  // Global ignores
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'android/',
      'ios/',
      'web-build/',
      '**/*.min.js',
      '**/coverage/**',
      '**/build/**',
      '**/dist/**',
    ],
  },
  // Base JavaScript configuration
  js.configs.recommended,
  
  // React Native configuration
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-native': reactNative,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // React Native globals
        __DEV__: 'readonly',
        
        // Node.js globals
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        
        // Browser/Timer globals
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        
        // Testing globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
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
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      
      // General JavaScript rules
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^(error|err)$' }],
      'no-console': 'off', // Allow console statements in React Native development
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
  }
];
