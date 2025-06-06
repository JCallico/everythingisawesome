import React from 'react';

const NewsDisplay = ({ stories }) => {
  if (!stories || stories.length === 0) {
    return <div className="error">No stories available.</div>;
  }

  return (
    <div className="stories-grid">
      {stories.map((story, index) => (
        <div key={index} className="story-card">
          <div className="story-header">
            <h3 className="story-title">{story.title}</h3>
            <div className="awesome-badge">{story.awesome_index}</div>
          </div>
          
          <p className="story-summary">{story.summary}</p>
          
          {story.link && (
            <a 
              href={story.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="story-link"
            >
              Read Full Story →
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default NewsDisplay;
