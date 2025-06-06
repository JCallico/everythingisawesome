require('dotenv').config();
const axios = require('axios');
const moment = require('moment');
const { saveNewsByDate, formatDateForFilename, getPreviousDate } = require('../utils/newsUtils');
const fs = require('fs-extra');
const path = require('path');

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// Function to fetch relevant image for a story
const fetchStoryImage = async (story) => {
  try {
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!unsplashApiKey) {
      console.log('UNSPLASH_ACCESS_KEY not found, using fallback image');
      return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop';
    }

    // Extract keywords from title and summary for image search
    const searchText = `${story.title} ${story.summary}`;
    const keywords = extractImageKeywords(searchText);
    
    const response = await axios.get(UNSPLASH_API_URL, {
      params: {
        query: keywords,
        per_page: 1,
        w: 800,
        h: 600,
        fit: 'crop',
        orientation: 'landscape'
      },
      headers: {
        'Authorization': `Client-ID ${unsplashApiKey}`
      }
    });

    if (response.data.results && response.data.results.length > 0) {
      const image = response.data.results[0];
      return `${image.urls.regular}&w=800&h=600&fit=crop`;
    } else {
      // Fallback to a positive, inspiring image
      return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop';
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error.message);
    return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop';
  }
};

// Function to extract relevant keywords for image search
const extractImageKeywords = (text) => {
  const lowercaseText = text.toLowerCase();
  
  // Define keyword mappings for better image search
  const keywordMappings = {
    medical: ['medical', 'health', 'doctor', 'hospital', 'medicine', 'treatment', 'cure', 'vaccine'],
    nature: ['environment', 'nature', 'forest', 'ocean', 'coral', 'wildlife', 'green', 'sustainability'],
    technology: ['ai', 'technology', 'innovation', 'digital', 'robot', 'computer', 'breakthrough'],
    education: ['education', 'school', 'learning', 'student', 'literacy', 'knowledge', 'classroom'],
    community: ['community', 'volunteer', 'helping', 'charity', 'support', 'together', 'unity'],
    science: ['science', 'research', 'discovery', 'lab', 'experiment', 'scientist', 'study'],
    celebration: ['celebration', 'festival', 'culture', 'art', 'music', 'joy', 'happiness']
  };
  
  // Find the most relevant category
  for (const [category, keywords] of Object.entries(keywordMappings)) {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      return `${category} positive inspiring uplifting`;
    }
  }
  
  // Default to hope and inspiration
  return 'hope inspiration positive uplifting success';
};

const fetchDailyNews = async (targetDate = null) => {
  try {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      console.error('GROK_API_KEY not found in environment variables');
      return false;
    }

    // Use provided date or default to yesterday
    const dateToFetch = targetDate ? formatDateForFilename(targetDate) : getPreviousDate(new Date());
    const formattedDate = moment(dateToFetch).format('MMMM Do, YYYY');
    
    // Read the example.json as template
    const examplePath = path.join(__dirname, '../../example.json');
    let exampleContent = '';
    
    try {
      const example = await fs.readJson(examplePath);
      exampleContent = JSON.stringify(example, null, 2);
    } catch (error) {
      console.log('Could not read example.json, using basic template');
    }

    const prompt = `Create top 10 most optimistic, feel-good, awe-inspiring news stories for ${formattedDate} (${dateToFetch}). These should be realistic, positive news stories that could plausibly happen on this date.

Your task: Generate 10 inspiring, uplifting news stories that restore hope in humanity and make you feel good about the human race. Make them realistic and believable, with authentic-sounding sources.

Focus on realistic stories about:
- Scientific breakthroughs that help humanity
- Environmental protection and restoration
- Acts of kindness and compassion
- Educational and social progress
- Medical advances
- Community initiatives
- Cultural celebrations
- Innovation for good
- Human resilience and triumph

Format the results as JSON with this exact structure:
{
  "date": "${dateToFetch}",
  "title": "Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories from ${formattedDate}",
  "stories": [
    {
      "title": "Compelling, realistic news headline",
      "summary": "Brief positive summary highlighting the inspiring aspect",
      "link": "https://realistic-news-source-url.com/article-path",
      "awesome_index": 95,
      "image": "placeholder"
    }
  ]
}

Requirements:
- Make stories realistic and believable
- Use authentic-sounding news source URLs (CNN, BBC, Reuters, NPR, etc.)
- The awesome_index should range from 50-100, with the most inspiring stories getting higher scores
- Stories should be genuinely uplifting and positive
- Include diverse topics and global perspectives

Set "image" to "placeholder" - this will be replaced with actual images. Return only the JSON, no additional text.`;

    const response = await axios.post(GROK_API_URL, {
      model: 'grok-2-latest',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    
    // Try to parse the JSON response
    let newsData;
    try {
      // Clean up the response in case it has markdown formatting
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      newsData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing API response as JSON:', parseError);
      console.log('Raw response:', content);
      return false;
    }

    // Validate the structure
    if (!newsData.date || !newsData.stories || !Array.isArray(newsData.stories)) {
      console.error('Invalid news data structure received from API');
      return false;
    }

    // Fetch images for each story
    console.log('Fetching relevant images for each story...');
    for (let i = 0; i < newsData.stories.length; i++) {
      const story = newsData.stories[i];
      console.log(`Fetching image for story ${i + 1}: ${story.title.substring(0, 50)}...`);
      
      const imageUrl = await fetchStoryImage(story);
      newsData.stories[i].image = imageUrl;
      
      // Add a small delay between requests to be respectful to the API
      if (i < newsData.stories.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log('Successfully fetched images for all stories');

    // Save the news data
    const success = await saveNewsByDate(dateToFetch, newsData);
    
    if (success) {
      console.log(`Successfully fetched and saved news for ${dateToFetch}`);
      return true;
    } else {
      console.error('Failed to save news data');
      return false;
    }

  } catch (error) {
    console.error('Error fetching daily news:', error);
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    }
    return false;
  }
};

// Allow manual execution
if (require.main === module) {
  console.log('Manually fetching daily news...');
  
  // Check for command line argument for target date
  const targetDate = process.argv[2] || null;
  if (targetDate) {
    console.log(`Fetching news for specific date: ${targetDate}`);
  }
  
  fetchDailyNews(targetDate).then(success => {
    if (success) {
      console.log('News fetch completed successfully');
    } else {
      console.log('News fetch failed');
    }
    process.exit(success ? 0 : 1);
  });
}

module.exports = { fetchDailyNews };
