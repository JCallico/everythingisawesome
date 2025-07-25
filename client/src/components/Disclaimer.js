import React, { useState, useEffect, useMemo } from 'react';
import { loadMarkdownContent, createMarkdownRenderer, disclaimerFooter, getCurrentDate } from '@everythingisawesome/shared-docs';

const Disclaimer = () => {
  const [content, setContent] = useState(null);
  
  // Create a renderer instance once using the generic renderer with web-specific options
  const renderer = useMemo(() => createMarkdownRenderer({
    platform: 'web',
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
  }), []);
  const { renderContent, renderListItems } = renderer;

  useEffect(() => {
    try {
      const markdownContent = loadMarkdownContent('disclaimer.md');
      setContent(markdownContent);
    } catch (error) {
      console.error('Error loading disclaimer content:', error);
      setContent({
        title: 'Legal Disclaimer & Terms of Use',
        sections: [{
          title: 'Error',
          content: 'Unable to load content at this time.'
        }]
      });
    }
  }, []);

  if (!content) {
    return (
      <div className="content-page-container">
        <div className="content-page-content">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="content-page-container">
      <div className="content-page-content">
        <h1>{content.title}</h1>
        
        {content.sections.map((section, index) => (
          <div key={index} className="content-page-section">
            <h2>{section.title}</h2>
            
            {section.subsections && section.subsections.length > 0 ? (
              section.subsections.map((subsection, subIndex) => (
                <div key={subIndex}>
                  <h3>{subsection.title}</h3>
                  {subsection.content && (
                    <p>{renderContent(subsection.content)}</p>
                  )}
                  {subsection.listItems && subsection.listItems.length > 0 && 
                    renderListItems(subsection.listItems, renderedItems => (
                      <ul>
                        {renderedItems.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    ))
                  }
                </div>
              ))
            ) : (
              <>
                {section.content && (
                  <p>{renderContent(section.content)}</p>
                )}
                {section.listItems && section.listItems.length > 0 && 
                  renderListItems(section.listItems, renderedItems => (
                    <ul>
                      {renderedItems.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  ))
                }
              </>
            )}
          </div>
        ))}

        <div className="content-page-footer">
          <p>
            <strong>{disclaimerFooter.text}</strong>
          </p>
          <p className="last-updated">
            {disclaimerFooter.lastUpdatedLabel}: {getCurrentDate()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
