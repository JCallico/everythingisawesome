#!/usr/bin/env node

/**
 * Test script to create sample news data for demonstration
 * This simulates what the daily news fetch would create
 */

const moment = require('moment');
const { saveNewsByDate, formatDateForFilename } = require('../utils/newsUtils');

const createSampleNews = async (date) => {
  const sampleNews = {
    date: date,
    title: "Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories",
    stories: [
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
    ]
  };

  const success = await saveNewsByDate(date, sampleNews);
  if (success) {
    console.log(`✅ Sample news created for ${date}`);
  } else {
    console.log(`❌ Failed to create sample news for ${date}`);
  }
  return success;
};

const createSampleData = async () => {
  console.log('Creating sample news data...\n');
  
  // Create news for yesterday
  const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
  await createSampleNews(yesterday);
  
  // Create news for day before yesterday
  const dayBefore = moment().subtract(2, 'days').format('YYYY-MM-DD');
  await createSampleNews(dayBefore);
  
  // Create news for three days ago
  const threeDaysAgo = moment().subtract(3, 'days').format('YYYY-MM-DD');
  await createSampleNews(threeDaysAgo);
  
  console.log('\n✅ Sample data creation complete!');
  console.log('You can now see multiple days of news in your application.');
};

// Run if called directly
if (require.main === module) {
  createSampleData().catch(console.error);
}

module.exports = { createSampleNews };
