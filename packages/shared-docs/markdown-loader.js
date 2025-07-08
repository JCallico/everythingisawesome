/**
 * Shared markdown content loader for web and mobile applications
 * Reads content from .js files and converts them to structured data
 */

// Import the content from .js files directly
import disclaimerContent from './disclaimer-content.js';
import howItWorksContent from './how-it-works-content.js';

/**
 * Reads a markdown file and parses it into structured content
 * @param {string} filename - The markdown filename (e.g., 'disclaimer.md')
 * @returns {Object} Parsed markdown content with title, sections, and subsections
 */
export function loadMarkdownContent(filename) {
  try {
    let content = '';
    
    // Load the markdown content based on the filename
    if (filename === 'disclaimer.md') {
      content = disclaimerContent;
    } else if (filename === 'how-it-works.md') {
      content = howItWorksContent;
    } else {
      throw new Error(`Unknown markdown file: ${filename}`);
    }
    
    return parseMarkdown(content);
  } catch (error) {
    console.error(`Error loading markdown file ${filename}:`, error);
    return {
      title: 'Content Not Available',
      sections: [{
        title: 'Error',
        content: 'Unable to load content at this time.'
      }]
    };
  }
}

/**
 * Parses markdown content into structured data
 * @param {string} markdown - Raw markdown content
 * @returns {Object} Structured content object
 */
export function parseMarkdown(markdown) {
  const lines = markdown.split('\n');
  const result = {
    title: '',
    sections: []
  };
  
  let currentSection = null;
  let currentSubsection = null;
  let currentContent = [];
  let currentListItems = [];
  let inList = false;
  
  const finishCurrentItem = () => {
    if (currentSubsection) {
      if (currentListItems.length > 0) {
        currentSubsection.listItems = currentListItems;
        currentListItems = [];
      }
      if (currentContent.length > 0) {
        currentSubsection.content = currentContent.join('\n').trim();
        currentContent = [];
      }
    } else if (currentSection && currentContent.length > 0) {
      currentSection.content = currentContent.join('\n').trim();
      currentContent = [];
    }
    inList = false;
  };
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Main title (# Title)
    if (trimmedLine.startsWith('# ') && !result.title) {
      result.title = trimmedLine.substring(2).trim();
      continue;
    }
    
    // Section headers (## Section)
    if (trimmedLine.startsWith('## ')) {
      // Save previous section
      if (currentSection) {
        finishCurrentItem();
        if (currentSubsection) {
          currentSection.subsections.push(currentSubsection);
        }
        result.sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: trimmedLine.substring(3).trim(),
        content: '',
        subsections: []
      };
      currentSubsection = null;
      currentContent = [];
      currentListItems = [];
      inList = false;
      continue;
    }
    
    // Subsection headers (### Subsection)
    if (trimmedLine.startsWith('### ')) {
      // Save previous subsection
      if (currentSubsection) {
        finishCurrentItem();
        currentSection.subsections.push(currentSubsection);
      } else if (currentContent.length > 0 && currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        currentContent = [];
      }
      
      // Start new subsection
      currentSubsection = {
        title: trimmedLine.substring(4).trim(),
        content: '',
        listItems: []
      };
      currentContent = [];
      currentListItems = [];
      inList = false;
      continue;
    }
    
    // List items (- item or * item)
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      if (!inList && currentContent.length > 0) {
        // Save content before list starts
        if (currentSubsection) {
          currentSubsection.content = currentContent.join('\n').trim();
        } else if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
        }
        currentContent = [];
      }
      inList = true;
      const listItem = trimmedLine.substring(2).trim();
      currentListItems.push(listItem);
      continue;
    }
    
    // Regular content
    if (trimmedLine) {
      if (inList) {
        // End of list, save list items
        if (currentSubsection) {
          currentSubsection.listItems = currentListItems;
        }
        currentListItems = [];
        inList = false;
      }
      currentContent.push(line);
    } else if (currentContent.length > 0) {
      currentContent.push(''); // Preserve paragraph breaks
    }
  }
  
  // Save final section/subsection
  if (currentSection) {
    finishCurrentItem();
    if (currentSubsection) {
      currentSection.subsections.push(currentSubsection);
    }
    result.sections.push(currentSection);
  }
  
  return result;
}

/**
 * Converts markdown links to appropriate format for the platform
 * @param {string} text - Text containing markdown links
 * @param {Function} linkHandler - Function to handle link clicks (optional)
 * @returns {string} Text with converted links
 */
export function convertMarkdownLinks(text, linkHandler = null) {
  // Convert markdown links [text](url) to HTML or appropriate format
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    if (linkHandler) {
      return `<link>${text}</link>`; // Placeholder for custom link handling
    }
    return `${text} (${url})`;
  });
}

/**
 * Converts markdown bold text to appropriate format
 * @param {string} text - Text containing markdown bold
 * @returns {string} Text with converted bold formatting
 */
export function convertMarkdownBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove markdown bold for plain text
}

/**
 * Processes markdown text for display in mobile/web components
 * @param {string} text - Raw markdown text
 * @param {Object} options - Processing options
 * @returns {string} Processed text
 */
export function processMarkdownText(text, options = {}) {
  let processed = text;
  
  if (options.preserveBold) {
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  } else {
    processed = convertMarkdownBold(processed);
  }
  
  if (options.linkHandler) {
    processed = convertMarkdownLinks(processed, options.linkHandler);
  } else {
    processed = convertMarkdownLinks(processed);
  }
  
  return processed;
}
