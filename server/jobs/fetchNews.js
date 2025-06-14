require('dotenv').config();
const axios = require('axios');
const moment = require('moment');
const { saveNewsByDate, formatDateForFilename, getPreviousDate } = require('../utils/newsUtils');
const fs = require('fs-extra');
const path = require('path');

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const NEWSAPI_URL = 'https://newsapi.org/v2/everything';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// Positive keywords to filter uplifting stories
const POSITIVE_KEYWORDS = [
  'breakthrough', 'cure', 'save', 'rescue', 'hero', 'amazing', 'incredible', 'inspiring',
  'hope', 'success', 'achievement', 'discovery', 'innovation', 'helping', 'volunteer',
  'donate', 'charity', 'kindness', 'compassion', 'recovered', 'survived', 'triumph',
  'victory', 'celebrate', 'milestone', 'progress', 'improvement', 'solved', 'fixed',
  'healthy', 'healing', 'restored', 'protected', 'scholarship', 'graduation', 'education',
  'community', 'together', 'unity', 'peace', 'collaboration', 'sustainable', 'green',
  'environment', 'conservation', 'renewable', 'clean', 'efficient', 'accessibility',
  'democracy', 'rights'
];

// News sources known for quality reporting
const NEWS_SOURCES = [
  'bbc-news', 'cnn', 'reuters', 'associated-press', 'npr', 'abc-news',
  'cbs-news', 'nbc-news', 'the-guardian-uk', 'independent', 'time',
  'national-geographic', 'scientific-american', 'new-scientist'
];

// Configuration: Set to true to filter by specific news sources, false to search all sources
const USE_SOURCE_FILTER = false;

// Function to fetch news articles from NewsAPI
const fetchNewsArticles = async (targetDate) => {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey) {
      throw new Error('NEWS_API_KEY not found in environment variables');
    }

    const fromDate = moment(targetDate).format('YYYY-MM-DD');
    const toDate = moment(targetDate).add(1, 'day').format('YYYY-MM-DD');
    
    // Create query with positive keywords
    const keywordQuery = POSITIVE_KEYWORDS.slice(0, 20).join(' OR ');
    
    // Build request parameters
    const requestParams = {
      q: keywordQuery,
      from: fromDate,
      to: toDate,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: 100
    };
    
    // Conditionally add sources filter
    if (USE_SOURCE_FILTER) {
      requestParams.sources = NEWS_SOURCES.join(',');
      console.log('Using source filter: specific news sources only');
    } else {
      console.log('Source filter disabled: searching all news sources');
    }
    
    const response = await axios.get(NEWSAPI_URL, {
      params: requestParams,
      headers: {
        'X-API-Key': newsApiKey
      }
    });

    if (response.data.articles && response.data.articles.length > 0) {
      return response.data.articles.filter(article => 
        article.title && 
        article.content && 
        article.url &&
        !article.title.includes('[Removed]') &&
        !article.content.includes('[Removed]')
      );
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error.message);
    return [];
  }
};

// Function to analyze sentiment using Grok API with retry logic
const analyzeSentimentWithGrok = async (articleText, retries = 3) => {
  try {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      throw new Error('GROK_API_KEY not found');
    }

    const prompt = `Analyze the sentiment of this news article and provide a positivity score from 0-100, where 100 is extremely positive and uplifting, and 0 is very negative.

Article text: "${articleText.substring(0, 1000)}"

Respond with only a number between 0-100 representing the positivity score.`;

    const response = await axios.post(GROK_API_URL, {
      model: 'grok-3-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 10
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content.trim();
    const score = parseInt(content);
    
    // Validate score is a number between 0-100
    if (isNaN(score) || score < 0 || score > 100) {
      throw new Error('Invalid sentiment score received');
    }
    
    return score;
  } catch (error) {
    console.error('Error analyzing sentiment:', error.message);
    if (error.response) {
      console.error('Grok API Error Response:', error.response.status, error.response.data);
    }
    
    if (retries > 0) {
      console.log(`Retrying sentiment analysis... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await analyzeSentimentWithGrok(articleText, retries - 1);
    }
    
    // Return fallback score of 50
    return 50;
  }
};

// Function to generate summary using Grok API
const generateSummaryWithGrok = async (articleText, retries = 3) => {
  try {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      throw new Error('GROK_API_KEY not found');
    }

    const prompt = `Create a concise, positive summary (2-3 sentences) for this news article, highlighting its most inspiring and uplifting aspects:

Article: "${articleText.substring(0, 1000)}"

Focus on the positive impact, hope, and inspiring elements. Keep it under 200 characters.`;

    const response = await axios.post(GROK_API_URL, {
      model: 'grok-3-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating summary:', error.message);
    if (error.response) {
      console.error('Grok API Error Response:', error.response.status, error.response.data);
    }
    
    if (retries > 0) {
      console.log(`Retrying summary generation... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await generateSummaryWithGrok(articleText, retries - 1);
    }
    
    // Return fallback summary
    return 'An inspiring story about positive change and human achievement.';
  }
};

// Function to calculate awesome index
const calculateAwesomeIndex = (sentimentScore, positiveKeywordCount) => {
  // Base score from sentiment (50-100)
  const baseSentimentScore = Math.max(50, Math.min(100, sentimentScore));
  
  // Boost based on positive keywords (up to 10 points)
  const keywordBoost = Math.min(10, positiveKeywordCount * 2);
  
  // Final score capped at 100, minimum 50
  const awesomeIndex = Math.max(50, Math.min(100, baseSentimentScore + keywordBoost));
  
  return Math.round(awesomeIndex);
};

// Function to count positive keywords in text
const countPositiveKeywords = (text) => {
  const lowercaseText = text.toLowerCase();
  return POSITIVE_KEYWORDS.filter(keyword => 
    lowercaseText.includes(keyword.toLowerCase())
  ).length;
};
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
    // Use provided date or default to yesterday
    const dateToFetch = targetDate ? formatDateForFilename(targetDate) : getPreviousDate(new Date());
    const formattedDate = moment(dateToFetch).format('MMMM Do, YYYY');
    
    console.log(`Fetching news for ${formattedDate} (${dateToFetch})`);
    
    // Step 1: Fetch articles from NewsAPI
    console.log('Step 1: Fetching articles from NewsAPI...');
    const articles = await fetchNewsArticles(dateToFetch);
    
    if (articles.length === 0) {
      console.error('No articles found from NewsAPI for the specified date');
      return false;
    }
    
    console.log(`Found ${articles.length} articles from NewsAPI`);
    
    // Step 2: Process articles with Grok API for sentiment and summarization
    console.log('Step 2: Processing articles with Grok API...');
    const processedArticles = [];
    
    for (let i = 0; i < Math.min(articles.length, 50); i++) { // Limit to 50 articles to manage API costs
      const article = articles[i];
      console.log(`Processing article ${i + 1}/${Math.min(articles.length, 50)}: ${article.title.substring(0, 50)}...`);
      
      // Combine title and content for analysis
      const articleText = `${article.title} ${article.content || article.description || ''}`;
      
      // Count positive keywords
      const keywordCount = countPositiveKeywords(articleText);
      
      // Skip articles with no positive keywords
      if (keywordCount === 0) {
        continue;
      }
      
      // Get sentiment score
      const sentimentScore = await analyzeSentimentWithGrok(articleText);
      
      // Skip articles with very low sentiment scores
      if (sentimentScore < 40) {
        continue;
      }
      
      // Generate summary
      const summary = await generateSummaryWithGrok(articleText);
      
      // Calculate awesome index
      const awesomeIndex = calculateAwesomeIndex(sentimentScore, keywordCount);
      
      processedArticles.push({
        title: article.title,
        summary: summary,
        link: article.url,
        awesome_index: awesomeIndex,
        image: 'placeholder',
        source: article.source?.name || 'News Source',
        publishedAt: article.publishedAt,
        sentimentScore: sentimentScore,
        keywordCount: keywordCount
      });
      
      // Add delay between API calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (processedArticles.length === 0) {
      console.error('No articles passed sentiment and keyword filtering');
      return false;
    }
    
    // Step 3: Rank and select top articles
    console.log('Step 3: Ranking articles by awesome_index...');
    processedArticles.sort((a, b) => b.awesome_index - a.awesome_index);
    
    // Select top 10 articles
    const topArticles = processedArticles.slice(0, 10);
    
    console.log(`Selected top ${topArticles.length} articles with awesome_index ranging from ${topArticles[topArticles.length-1].awesome_index} to ${topArticles[0].awesome_index}`);
    
    // Step 4: Fetch images for each story
    console.log('Step 4: Fetching relevant images for each story...');
    for (let i = 0; i < topArticles.length; i++) {
      const story = topArticles[i];
      console.log(`Fetching image for story ${i + 1}: ${story.title.substring(0, 50)}...`);
      
      const imageUrl = await fetchStoryImage(story);
      topArticles[i].image = imageUrl;
      
      // Remove processing metadata from final output
      delete topArticles[i].sentimentScore;
      delete topArticles[i].keywordCount;
      delete topArticles[i].source;
      delete topArticles[i].publishedAt;
      
      // Add a small delay between requests to be respectful to the API
      if (i < topArticles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Step 5: Format final output
    const newsData = {
      date: dateToFetch,
      title: `Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories from ${formattedDate}`,
      stories: topArticles
    };
    
    console.log('Successfully processed and ranked all stories');

    // Save the news data
    const success = await saveNewsByDate(dateToFetch, newsData);
    
    if (success) {
      console.log(`Successfully fetched and saved news for ${dateToFetch}`);
      console.log(`Top story: "${topArticles[0].title}" (awesome_index: ${topArticles[0].awesome_index})`);
      return true;
    } else {
      console.error('Failed to save news data');
      return false;
    }

  } catch (error) {
    console.error('Error in fetchDailyNews:', error);
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
