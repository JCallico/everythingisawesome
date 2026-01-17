import path from 'path';

// Debug environment information
console.log('🔍 Environment Debug Info:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Working Directory: ${process.cwd()}`);

// Load .env from root directory (only in development)
// Skip dotenv loading in Azure App Service production environment
const isAzureProduction = process.env.WEBSITE_SITE_NAME || process.env.APPSETTING_WEBSITE_SITE_NAME;
if (!isAzureProduction && process.env.NODE_ENV !== 'production') {
  console.log('📝 Loading .env file for local development');
  // Use dynamic import but don't await at top level
  import('dotenv').then(dotenv => {
    dotenv.config({ path: path.join(process.cwd(), '../.env') });
  }).catch(err => {
    console.log('📝 Could not load dotenv:', err.message);
  });
} else {
  console.log('🔧 Using Azure Application Settings (skipping .env file)');
}

// Check if critical environment variables are available
const aiProvider = (process.env.AI_PROVIDER || 'grok').toLowerCase();
console.log('🔑 Environment Variables Check:');
console.log(`   AI_PROVIDER: ${aiProvider}`);
console.log(`   GROK_API_KEY: ${process.env.GROK_API_KEY ? 'SET' : 'MISSING'}`);
console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'SET' : 'MISSING'}`);
console.log(`   NEWS_API_KEY: ${process.env.NEWS_API_KEY ? 'SET' : 'MISSING'}`);

// Exit early if critical variables are missing
const isAiKeyMissing = (aiProvider === 'grok' && !process.env.GROK_API_KEY) || 
                       (aiProvider === 'gemini' && !process.env.GEMINI_API_KEY);

if (isAiKeyMissing || !process.env.NEWS_API_KEY) {
  console.error('❌ Critical environment variables missing. Cannot proceed.');
  console.error('💡 In Azure: Configure these in Application Settings');
  console.error('💡 Locally: Add these to your .env file');
  process.exit(1);
}

console.log('✅ Starting news fetch process...');

import axios from 'axios';
console.log('📦 Loaded axios');

import moment from 'moment';
console.log('📦 Loaded moment');

import { saveNewsByDate, formatDateForFilename, getPreviousDate } from '../utils/newsUtils.js';
console.log('📦 Loaded newsUtils');

import { createFileSystem } from '../filesystem/FileSystemFactory.js';
console.log('📦 Loaded FileSystemFactory');

import { createAIService } from '../ai/AIServiceFactory.js';
console.log('📦 Loaded AIServiceFactory');

import * as fuzzball from 'fuzzball';
console.log('📦 Loaded fuzzball');

// Initialize file system abstraction
const fileSystem = createFileSystem();
console.log('📦 Initialized file system');

// Initialize AI Service
const aiService = createAIService();
console.log('📦 Initialized AI Service');

const NEWSAPI_URL = 'https://newsapi.org/v2/everything';

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
// Function to generate image using AI Service
const generateStoryImage = async (story, storyIndex) => {
  try {
    // Create a detailed prompt for image generation based on the story
    let imagePrompt;
    try {
      imagePrompt = await aiService.generateImagePrompt(story);
      console.log(`  Generated prompt: "${imagePrompt}"`);
    } catch (e) {
      console.log('  Error generating prompt with AI, using basic prompt');
      imagePrompt = createBasicImagePrompt(story);
    }
    
    // Try AI image generation
    try {
      const base64Image = await aiService.generateImage(imagePrompt);
      
      if (base64Image) {
        // Save the base64 image locally
        const savedImagePath = await saveBase64Image(base64Image, storyIndex);
        
        if (savedImagePath) {
          console.log(`  ✓ Image generated with AI and saved: ${savedImagePath}`);
          return savedImagePath;
        }
      }
    } catch (aiError) {
      if (aiError.message && aiError.message.includes('not supported')) {
        console.log(`  ⚠ ${aiError.message} Using themed fallback...`);
      } else {
        console.log('  AI image generation failed, using themed fallback...');
        // Only log full error for debugging if it's not a known "not supported" error
        // console.error(aiError);
      }
    }

    // Fallback to themed static local image
    return getFallbackImage(story);
    
  } catch (error) {
    console.error('Error in image generation process:', error.message);
    return getFallbackImage(story);
  }
};



// Create a basic image prompt without using Grok
const createBasicImagePrompt = (story) => {
  // Detect the main theme and create appropriate prompt using unified theme system
  const themes = {
    'health': 'A bright, modern medical research laboratory with scientists working on breakthrough treatments, conveying hope and healing',
    'nature': 'A beautiful, pristine natural landscape showcasing environmental conservation and sustainability, conveying hope for the future',
    'innovation': 'A futuristic, clean technology workspace with innovative devices and digital interfaces, representing progress and innovation',
    'community': 'People coming together in a positive community setting, showing unity, support, and collaborative spirit',
    'education': 'A bright, inspiring classroom or learning environment with students engaged in discovery, showing growth and achievement',
    'sports': 'An inspiring athletic achievement moment with celebration and triumph, showing human potential and success',
    'science': 'A state-of-the-art research facility with scientists making discoveries, representing breakthrough and progress',
    'arts': 'A vibrant, creative artistic scene showcasing cultural expression and creativity, inspiring and uplifting',
    'business': 'A modern, dynamic business environment with entrepreneurs and innovators creating positive change, showing growth and success',
    'entertainment': 'A joyful entertainment scene with performers and audiences celebrating creativity and shared experiences',
    'travel': 'An inspiring travel destination showcasing adventure, discovery, and cultural connection, conveying wonder and exploration',
    'food': 'A warm, inviting culinary scene with chefs and food enthusiasts celebrating culture and community through cuisine',
    'lifestyle': 'A balanced, harmonious lifestyle scene showing wellness, personal growth, and positive living choices',
    'politics': 'A hopeful civic scene showing democratic participation, positive governance, and community engagement for the greater good',
    'economy': 'An optimistic economic scene showing innovation, fair trade, and sustainable prosperity for all',
    'world': 'A peaceful, connected global scene showing international cooperation and positive diplomatic relationships',
    'inspiring': 'An uplifting scene of human achievement and triumph, showing the best of humanity and inspiring hope for the future',
    'hope': 'A bright, uplifting scene showing hope, progress, and positive human achievement, with warm lighting and inspiring atmosphere'
  };
  
  // Find the best matching theme using the unified detection function
  const detectedTheme = detectStoryTheme(story);
  
  // Return the prompt for the detected theme or a default
  return themes[detectedTheme] || 'A bright, uplifting scene showing hope, progress, and positive human achievement, with warm lighting and inspiring atmosphere';
};

// Save base64 image data to file
const saveBase64Image = async (base64Data, storyIndex) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `story-${storyIndex + 1}-${timestamp}.png`;
    const filepath = `generated-images/${filename}`;
    
    // Convert base64 to buffer and save
    const imageBuffer = Buffer.from(base64Data, 'base64');
    await fileSystem.write(filepath, imageBuffer);
    
    // Return the public URL path
    return `/generated-images/${filename}`;
    
  } catch (error) {
    console.error('Error saving base64 image:', error.message);
    return null;
  }
};

// Unified theme dictionary with keywords for each theme (matches NewsDisplay component)
const THEME_KEYWORDS = {
  'health': ['medical', 'health', 'cancer', 'treatment', 'hospital', 'doctor', 'medicine', 'vaccine'],
  'nature': ['environment', 'coral', 'forest', 'nature', 'climate', 'wildlife', 'ocean', 'green', 'sustainability'],
  'innovation': ['ai', 'technology', 'innovation', 'breakthrough', 'robot', 'digital', 'software', 'internet', 'computer'],
  'community': ['community', 'volunteer', 'together', 'support', 'charity', 'help', 'donate', 'social'],
  'education': ['education', 'learning', 'school', 'literacy', 'student', 'university', 'teaching', 'academic'],
  'sports': ['sport', 'game', 'team', 'player', 'championship', 'olympic', 'fitness', 'athlete', 'competition'],
  'science': ['science', 'research', 'study', 'discovery', 'experiment', 'laboratory', 'scientist', 'physics', 'chemistry'],
  'arts': ['art', 'music', 'film', 'culture', 'museum', 'artist', 'creative', 'design', 'theater'],
  'business': ['business', 'company', 'startup', 'finance', 'investment', 'market', 'economic', 'profit', 'trade'],
  'entertainment': ['entertainment', 'celebrity', 'movie', 'show', 'concert', 'festival', 'performance', 'comedy'],
  'travel': ['travel', 'tourism', 'vacation', 'adventure', 'journey', 'destination', 'explore', 'trip'],
  'food': ['food', 'restaurant', 'cooking', 'recipe', 'chef', 'cuisine', 'dining', 'meal'],
  'lifestyle': ['lifestyle', 'wellness', 'beauty', 'fashion', 'home', 'family', 'relationship', 'personal'],
  'politics': ['politics', 'government', 'election', 'policy', 'law', 'congress', 'president', 'vote'],
  'economy': ['economy', 'inflation', 'gdp', 'unemployment', 'banking', 'currency', 'stock', 'financial'],
  'world': ['world', 'international', 'global', 'country', 'nation', 'diplomatic', 'foreign', 'border'],
  'inspiring': ['inspiring', 'amazing', 'incredible', 'wonderful', 'uplifting', 'positive', 'heartwarming', 'triumph']
};

// Function to detect theme from story content using unified theme system
const detectStoryTheme = (story) => {
  const title = story.title.toLowerCase();
  const summary = story.summary.toLowerCase();
  const combinedText = `${title} ${summary}`;
  
  // Search through theme keywords to find the best match
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      return theme;
    }
  }
  
  // Default theme
  return 'hope';
};

// Fallback to themed static local images
const getFallbackImage = (story) => {
  if (!story) {
    return '/generated-images/fallback-hope.png';
  }
  
  const theme = detectStoryTheme(story);
  return `/generated-images/fallback-${theme}.png`;
};

/**
 * Detects if two news stories are duplicates based on content analysis
 * @param {Object} story1 - First story object with title and summary
 * @param {Object} story2 - Second story object with title and summary  
 * @param {number} threshold - Similarity threshold (default: 60)
 * @returns {Object} - { isDuplicate: boolean, score: number, reasons: string[] }
 */
const isDuplicateStory = (story1, story2, threshold = 70) => {
  // Generic duplicate detection using only fuzzy text similarity
  // No hardcoded keywords - works for any type of content
  
  // Test multiple fuzzy matching approaches for maximum accuracy
  const titleRatio = fuzzball.ratio(story1.title, story2.title);
  const titlePartialRatio = fuzzball.partial_ratio(story1.title, story2.title);
  const titleTokenSort = fuzzball.token_sort_ratio(story1.title, story2.title);
  const titleTokenSet = fuzzball.token_set_ratio(story1.title, story2.title);
  
  const summaryRatio = fuzzball.ratio(story1.summary, story2.summary);
  const summaryPartialRatio = fuzzball.partial_ratio(story1.summary, story2.summary);
  const summaryTokenSort = fuzzball.token_sort_ratio(story1.summary, story2.summary);
  const summaryTokenSet = fuzzball.token_set_ratio(story1.summary, story2.summary);
  
  // Combined text analysis for comprehensive comparison
  const text1 = `${story1.title} ${story1.summary}`;
  const text2 = `${story2.title} ${story2.summary}`;
  const combinedRatio = fuzzball.ratio(text1, text2);
  const combinedPartialRatio = fuzzball.partial_ratio(text1, text2);
  const combinedTokenSort = fuzzball.token_sort_ratio(text1, text2);
  const combinedTokenSet = fuzzball.token_set_ratio(text1, text2);
  
  // Find the best score across all methods
  const allScores = [
    titleRatio, titlePartialRatio, titleTokenSort, titleTokenSet,
    summaryRatio, summaryPartialRatio, summaryTokenSort, summaryTokenSet,
    combinedRatio, combinedPartialRatio, combinedTokenSort, combinedTokenSet
  ];
  
  const maxScore = Math.max(...allScores);
  
  // Determine which method gave the best score for transparency
  let bestMethod = 'ratio';
  if (maxScore === titleTokenSet) bestMethod = 'title_token_set';
  else if (maxScore === titlePartialRatio) bestMethod = 'title_partial';
  else if (maxScore === summaryTokenSet) bestMethod = 'summary_token_set';
  else if (maxScore === combinedTokenSet) bestMethod = 'combined_token_set';
  else if (maxScore === combinedPartialRatio) bestMethod = 'combined_partial';
  else if (maxScore === titleTokenSort) bestMethod = 'title_token_sort';
  else if (maxScore === summaryTokenSort) bestMethod = 'summary_token_sort';
  
  return {
    isDuplicate: maxScore >= threshold,
    score: Math.round(maxScore),
    reasons: [`Generic text similarity via ${bestMethod} (${Math.round(maxScore)}%)`],
    method: 'generic-fuzzy-matching'
  };
};

/**
 * Removes duplicate stories from a list, keeping the highest scoring ones
 * @param {Array} stories - Array of story objects with awesome_index
 * @param {number} threshold - Duplicate detection threshold
 * @returns {Array} - Deduplicated array of stories
 */
const removeDuplicates = (stories, threshold = 70) => {
  const duplicateGroups = [];
  const processed = new Set();
  
  console.log(`  Starting deduplication of ${stories.length} stories...`);
  
  // Find all duplicate groups
  for (let i = 0; i < stories.length; i++) {
    if (processed.has(i)) continue;
    
    const group = [i];
    
    for (let j = i + 1; j < stories.length; j++) {
      if (processed.has(j)) continue;
      
      const result = isDuplicateStory(stories[i], stories[j], threshold);
      
      if (result.isDuplicate) {
        group.push(j);
        console.log(`    Found duplicate: Story ${i + 1} & ${j + 1} (${result.score}): ${result.reasons.join(', ')}`);
      }
    }
    
    if (group.length > 1) {
      duplicateGroups.push(group);
      group.forEach(idx => processed.add(idx));
    } else {
      processed.add(i);
    }
  }
  
  console.log(`  Found ${duplicateGroups.length} duplicate groups`);
  
  // For each duplicate group, keep only the story with highest awesome_index
  const toRemove = new Set();
  
  duplicateGroups.forEach((group, _groupIndex) => {
    // Sort by awesome_index descending
    group.sort((a, b) => stories[b].awesome_index - stories[a].awesome_index);
    
    const keeper = group[0];
    const duplicates = group.slice(1);
    
    console.log(`    Keeping: Story ${keeper + 1} "${stories[keeper].title.substring(0, 50)}..." (score: ${stories[keeper].awesome_index})`);
    
    duplicates.forEach(idx => {
      console.log(`    Removing: Story ${idx + 1} "${stories[idx].title.substring(0, 50)}..." (score: ${stories[idx].awesome_index})`);
      toRemove.add(idx);
    });
  });
  
  // Filter out duplicates
  const deduplicated = stories.filter((_, index) => !toRemove.has(index));
  
  console.log(`  Deduplication complete: ${stories.length} → ${deduplicated.length} stories (-${toRemove.size})`);
  
  return deduplicated;
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
    
    // Step 2: Process articles with AI for sentiment and summarization
    console.log('Step 2: Processing articles with AI...');
    const processedArticles = [];
    
    for (let i = 0; i < Math.min(articles.length, 100); i++) { // Process up to 100 articles for better selection pool
      const article = articles[i];
      console.log(`Processing article ${i + 1}/${Math.min(articles.length, 100)}: ${article.title.substring(0, 50)}...`);
      
      // Combine title and content for analysis
      const articleText = `${article.title} ${article.content || article.description || ''}`;
      
      // Count positive keywords
      const keywordCount = countPositiveKeywords(articleText);
      
      // Skip articles with no positive keywords
      if (keywordCount === 0) {
        continue;
      }
      
      // Get sentiment score
      let sentimentScore = 50;
      try {
        sentimentScore = await aiService.analyzeSentiment(articleText);
      } catch (e) {
        // console.log('Sentiment analysis failed, using default 50');
      }
      
      // Skip articles with very low sentiment scores
      if (sentimentScore < 40) {
        continue;
      }
      
      // Generate summary
      let summary = article.description || articleText.substring(0, 200);
      try {
        summary = await aiService.generateSummary(articleText);
      } catch (e) {
        // console.log('Summary generation failed, using fallback');
      }
      // Calculate awesome index
      const awesomeIndex = calculateAwesomeIndex(sentimentScore, keywordCount);
      
      // Detect theme for the story
      const theme = detectStoryTheme({
        title: article.title,
        summary: summary
      });

      processedArticles.push({
        title: article.title,
        summary: summary,
        link: article.url,
        awesome_index: awesomeIndex,
        theme: theme,
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
    
    // Step 3: Rank articles by awesome_index
    console.log('Step 3: Ranking articles by awesome_index...');
    processedArticles.sort((a, b) => b.awesome_index - a.awesome_index);
    
    // Step 3.5: Remove duplicate stories
    console.log('Step 3.5: Removing duplicate stories...');
    const deduplicatedArticles = removeDuplicates(processedArticles, 70);
    
    // Step 4: Select top 10 articles from deduplicated list
    const topArticles = deduplicatedArticles.slice(0, 10);
    
    console.log(`Selected top ${topArticles.length} unique articles with awesome_index ranging from ${topArticles[topArticles.length-1].awesome_index} to ${topArticles[0].awesome_index}`);
    
    // Step 5: Generate custom images for each story using AI
    console.log('Step 5: Generating custom AI images for each story using AI...');
    for (let i = 0; i < topArticles.length; i++) {
      const story = topArticles[i];
      console.log(`Generating image for story ${i + 1}: ${story.title.substring(0, 50)}...`);
      
      const imageUrl = await generateStoryImage(story, i);
      topArticles[i].image = imageUrl;
      
      // Add a delay between requests to respect API rate limits
      if (i < topArticles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds between image generations
      }
    }

    // Step 6: Generate opinions for each story using AI
    console.log('Step 6: Generating opinions for each story...');
    for (let i = 0; i < topArticles.length; i++) {
      const story = topArticles[i];
      console.log(`Generating opinion for story ${i + 1}/${topArticles.length}: ${story.title.substring(0, 50)}...`);
      
      let opinion = '';
      try {
        opinion = await aiService.generateOpinion(story.link, story.title);
      } catch (e) {
        // console.log('Opinion generation failed');
      }

      if (opinion) {
        topArticles[i].opinion = opinion;
        console.log(`  ✓ Opinion generated (${opinion.length} characters)`);
      } else {
        console.log('  ⚠ Skipped opinion for this story');
      }
      
      // Add a delay between requests to avoid rate limiting
      if (i < topArticles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second between opinion generations
      }
    }
    
    // Step 7: Format final output
    for (let i = 0; i < topArticles.length; i++) {
      // Remove processing metadata from final output
      delete topArticles[i].sentimentScore;
      delete topArticles[i].keywordCount;
      delete topArticles[i].source;
      delete topArticles[i].publishedAt;
    }

    const newsData = {
      date: dateToFetch,
      title: `Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories from ${formattedDate}`,
      aiProvider: aiService.getProviderName(),
      aiModel: aiService.getModelName(),
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

// Allow manual execution (ES module equivalent of require.main === module)
console.log('🔍 Checking execution condition...');
console.log(`   import.meta.url: ${import.meta.url}`);
console.log(`   process.argv[1]: ${process.argv[1]}`);

// Normalize paths for Windows compatibility
const normalizeFileUrl = (url) => {
  return url.replace(/^file:\/+/, 'file:///').replace(/\\/g, '/');
};

const currentFileUrl = normalizeFileUrl(import.meta.url);
const expectedFileUrl = normalizeFileUrl(`file://${process.argv[1]}`);

console.log(`   Normalized current: ${currentFileUrl}`);
console.log(`   Normalized expected: ${expectedFileUrl}`);
console.log(`   Match: ${currentFileUrl === expectedFileUrl}`);

if (currentFileUrl === expectedFileUrl) {
  console.log('✅ Manual execution detected!');
  console.log('Manually fetching daily news...');
  
  // Check for command line argument for target date
  const targetDate = process.argv[2] || null;
  if (targetDate) {
    console.log(`Fetching news for specific date: ${targetDate}`);
  }
  
  console.log('🚀 Starting fetchDailyNews...');
  fetchDailyNews(targetDate).then(success => {
    if (success) {
      console.log('News fetch completed successfully');
    } else {
      console.log('News fetch failed');
    }
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal error in fetchDailyNews:', error);
    process.exit(1);
  });
} else {
  console.log('📝 Script loaded as module, not executing directly');
}

export { fetchDailyNews };
