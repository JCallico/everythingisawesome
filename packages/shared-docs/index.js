/**
 * Main exports for shared-docs package
 */

export { 
  loadMarkdownContent,
  parseMarkdown,
  processMarkdownText,
  convertMarkdownLinks,
  convertMarkdownBold
} from './markdown-loader.js';

// Export the markdown renderer utilities
export {
  createMarkdownRenderer,
  createWebRenderer,
  createNativeRenderer,
  PlatformType,
  getCurrentDate
} from './markdown-renderer.js';

// Also export the content directly for use cases that need it
export { default as disclaimerContent, disclaimerFooter } from './disclaimer-content.js';
export { default as howItWorksContent, howItWorksFooter } from './how-it-works-content.js';
