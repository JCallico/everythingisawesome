import js from '@eslint/js';

export default [
  // Ignore patterns - must come first
  {
    ignores: [
      'node_modules/',
      'client/**/*',      // Let client use its own ESLint config
      'mobile/**/*',      // Let mobile use its own ESLint config
      'packages/**/*',    // Let packages use their own configs
      'data/**/*',
      '**/*.min.js',
      '**/coverage/**/*',
      '**/build/**/*',
      '**/dist/**/*',
    ],
  },
  // Base configuration for all JavaScript files in root and server
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js globals
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        module: 'writable',
        require: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'indent': ['error', 2],
      'linebreak-style': 'off', // Allow both LF and CRLF line endings
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      'no-console': 'off', // Allow console statements in Node.js server
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
