#!/usr/bin/env node

/**
 * Test script to create sample news data for demonstration
 * This simulates what the daily news fetch would create
 */

const moment = require('moment');
const { saveNewsByDate, formatDateForFilename } = require('../utils/newsUtils');

// Theme detection function (same as in fetchNews.js)
const detectStoryTheme = (story) => {
  const title = story.title.toLowerCase();
  const summary = story.summary.toLowerCase();
  const combinedText = `${title} ${summary}`;
  
  const themeKeywords = {
    community: ['community', 'volunteer', 'charity', 'helping', 'support', 'together', 'neighborhood', 'kindness', 'heroes', 'garden', 'viral', 'movement'],
    medical: ['medical', 'health', 'doctor', 'hospital', 'cure', 'treatment', 'vaccine', 'clinical', 'autoimmune', 'mental health'],
    education: ['education', 'school', 'student', 'learning', 'university', 'study', 'unesco'],
    environment: ['environment', 'nature', 'green', 'climate', 'sustainable', 'renewable', 'energy', 'ocean cleanup', 'plastic', 'conservation', 'wind', 'solar'],
    technology: ['technology', 'ai', 'innovation', 'digital', 'tech', 'software', 'device', 'artificial intelligence', 'solar panel', 'remote learning'],
    science: ['science', 'research', 'discovery', 'scientist', 'study', 'breakthrough', 'clinical trials'],
    sports: ['sport', 'athlete', 'game', 'victory', 'championship', 'competition'],
    arts: ['art', 'music', 'culture', 'creative', 'artist', 'performance']
  };
  
  // Find the best matching theme
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      return theme;
    }
  }
  
  // Default theme
  return 'general';
};

// Generate themed fallback image for a story
const getThemedFallbackImage = (story) => {
  const theme = detectStoryTheme(story);
  return `/generated-images/fallback-${theme}.png`;
};

const createSampleNews = async (date) => {
  const sampleStories = [
    {
      title: "Revolutionary Clean Energy Breakthrough",
      summary: "Scientists developed a new solar panel technology that's 50% more efficient, bringing us closer to affordable clean energy for everyone and accelerating the fight against climate change.",
      link: "https://example.com/solar-breakthrough",
      awesome_index: 98
    },
    {
      title: "Global Education Initiative Reaches Milestone",
      summary: "UNESCO announced that 1 million more children gained access to education this year through innovative remote learning programs, creating brighter futures worldwide.",
      link: "https://example.com/education-milestone",
      awesome_index: 95
    },
    {
      title: "Medical Marvel: New Treatment Shows Promise",
      summary: "Clinical trials reveal a groundbreaking treatment that could help millions of people with autoimmune diseases live healthier, fuller lives.",
      link: "https://example.com/medical-breakthrough",
      awesome_index: 92
    },
    {
      title: "Community Heroes Transform Neighborhood",
      summary: "Local volunteers in Detroit transformed an abandoned lot into a thriving community garden, providing fresh food and bringing neighbors together.",
      link: "https://example.com/community-garden",
      awesome_index: 88
    },
    {
      title: "Tech for Good: AI Helps Conservation",
      summary: "Artificial intelligence is now being used to track and protect endangered species, giving conservationists powerful new tools to preserve wildlife.",
      link: "https://example.com/ai-conservation",
      awesome_index: 85
    },
    {
      title: "Ocean Cleanup Project Removes Record Plastic",
      summary: "The Ocean Cleanup project removed 100,000 pounds of plastic from the Great Pacific Garbage Patch, marking their most successful cleanup yet.",
      link: "https://example.com/ocean-cleanup",
      awesome_index: 82
    },
    {
      title: "Students Design Solution for Water Crisis",
      summary: "High school students in Kenya invented a low-cost water purification system that could help millions access clean drinking water.",
      link: "https://example.com/student-innovation",
      awesome_index: 80
    },
    {
      title: "Mental Health Support Expands Globally",
      summary: "New mental health support programs launched in 50 countries, providing free counseling and support to those who need it most.",
      link: "https://example.com/mental-health",
      awesome_index: 78
    },
    {
      title: "Renewable Energy Milestone Achieved",
      summary: "Wind and solar power now generate 40% of the world's electricity, marking a historic shift toward sustainable energy.",
      link: "https://example.com/renewable-milestone",
      awesome_index: 75
    },
    {
      title: "Acts of Kindness Go Viral",
      summary: "A simple act of kindness by a grocery store worker sparked a global movement of people helping strangers, restoring faith in human goodness.",
      link: "https://example.com/kindness-viral",
      awesome_index: 72
    }
  ];

  // Add themed fallback images to each story
  const storiesWithImages = sampleStories.map(story => ({
    ...story,
    image: getThemedFallbackImage(story)
  }));

  const sampleNews = {
    date: date,
    title: `Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories from ${moment(date).format('MMMM Do, YYYY')}`,
    stories: storiesWithImages
  };

  const success = await saveNewsByDate(date, sampleNews);
  if (success) {
    console.log(`✅ Sample news created for ${date}`);
    console.log(`   Stories assigned themed fallback images based on content`);
  } else {
    console.log(`❌ Failed to create sample news for ${date}`);
  }
  return success;
};

const createSampleData = async (targetDate = null) => {
  console.log('Creating sample news data...\n');
  
  if (targetDate) {
    // Create sample data for the specific date
    console.log(`Creating sample data for specific date: ${targetDate}`);
    await createSampleNews(targetDate);
  } else {
    // Create news for yesterday
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    await createSampleNews(yesterday);
    
    // Create news for day before yesterday
    const dayBefore = moment().subtract(2, 'days').format('YYYY-MM-DD');
    await createSampleNews(dayBefore);
    
    // Create news for three days ago
    const threeDaysAgo = moment().subtract(3, 'days').format('YYYY-MM-DD');
    await createSampleNews(threeDaysAgo);
  }
  
  console.log('\n✅ Sample data creation complete!');
  console.log('You can now see the news with themed fallback images in your application.');
};

// Run if called directly
if (require.main === module) {
  // Check for command line argument for target date
  const targetDate = process.argv[2] || null;
  if (targetDate) {
    console.log(`Creating sample data for specific date: ${targetDate}`);
  }
  
  createSampleData(targetDate).catch(console.error);
}

module.exports = { createSampleNews };
