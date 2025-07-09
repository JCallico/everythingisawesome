module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['off'], // Allow both LF and CRLF line endings
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': ['off'], // Allow console statements in Node.js server
    'no-debugger': ['error'],
    'prefer-const': ['error'],
    'no-var': ['error'],
  },
  ignorePatterns: [
    'node_modules/',
    'client/',
    'mobile/',
    'packages/',
    'data/',
    '*.min.js',
    'coverage/',
    'build/',
    'dist/',
  ],
};
