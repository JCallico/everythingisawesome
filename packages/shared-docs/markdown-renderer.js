/**
 * Platform-agnostic markdown rendering utilities
 * Works with both React (web) and React Native
 */

/**
 * Configuration options to adapt rendering for different platforms
 */
export const PlatformType = {
  WEB: 'web',
  NATIVE: 'native'
};

/**
 * Creates a set of platform-specific markdown rendering functions
 * @param {Object} options - Configuration options
 * @param {string} options.platform - Either 'web' or 'native'
 * @param {Function} options.createLinkElement - Function to create link elements
 * @param {Function} options.createBoldElement - Function to create bold/strong elements
 * @param {Function} options.createTextWrapper - Function to create text wrapper elements
 * @returns {Object} Collection of rendering functions
 */
export const createMarkdownRenderer = (options) => {
  const {
    platform = PlatformType.WEB,
    createLinkElement,
    createBoldElement,
    createTextWrapper
  } = options;

  /**
   * Renders markdown content with links and bold text
   * @param {string} text - Text content with markdown formatting
   * @returns {Array|string} Rendered elements or text
   */
  const renderContent = (text) => {
    if (!text) return null;
    
    // Handle links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        parts.push(renderTextWithBold(beforeText, parts.length));
      }
      
      // Add the link
      parts.push(
        createLinkElement(match[1], match[2], `link-${parts.length}`)
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      parts.push(renderTextWithBold(remainingText, parts.length));
    }
    
    return parts.length > 0 ? parts : renderTextWithBold(text, 0);
  };

  /**
   * Renders text with bold formatting
   * @param {string} text - Text potentially containing bold markdown
   * @param {number|string} key - React key for the element
   * @returns {Array|string} Rendered elements or text
   */
  const renderTextWithBold = (text, key) => {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add bold text
      parts.push(
        createBoldElement(match[1], `bold-${key}-${parts.length}`)
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    // If we have multiple parts, wrap them; otherwise just return the text
    return parts.length > 0 ? createTextWrapper(parts, key) : text;
  };

  /**
   * Renders a list of items with markdown formatting
   * @param {Array} items - List of text items with markdown
   * @returns {Object} Rendered list element
   */
  const renderListItems = (items, createListElement) => {
    return createListElement(items.map((item, index) => renderContent(item)));
  };

  return {
    renderContent,
    renderTextWithBold,
    renderListItems,
    platform
  };
};

// Example web implementation (can be used directly or as reference)
export const createWebRenderer = (React) => {
  return createMarkdownRenderer({
    platform: PlatformType.WEB,
    createLinkElement: (text, url, key) => React.createElement(
      'a',
      { 
        key,
        href: url,
        target: "_blank",
        rel: "noopener noreferrer"
      },
      text
    ),
    createBoldElement: (text, key) => React.createElement(
      'strong',
      { key },
      text
    ),
    createTextWrapper: (children, key) => React.createElement(
      'span',
      { key },
      ...children
    ),
  });
};

// Example React Native implementation (can be used directly or as reference)
export const createNativeRenderer = (React, Linking) => {
  return createMarkdownRenderer({
    platform: PlatformType.NATIVE,
    createLinkElement: (text, url, key) => React.createElement(
      'Text',
      {
        key,
        style: { color: '#3498db', textDecorationLine: 'underline' },
        onPress: () => Linking.openURL(url)
      },
      text
    ),
    createBoldElement: (text, key) => React.createElement(
      'Text',
      {
        key,
        style: { fontWeight: 'bold', color: '#1a1a1a' }
      },
      text
    ),
    createTextWrapper: (children, key) => React.createElement(
      'Text',
      { key },
      ...children
    ),
  });
};

/**
 * Standalone utility function for getting the current date
 * @returns {string} Formatted date string
 */
export const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
