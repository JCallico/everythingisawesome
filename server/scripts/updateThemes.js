#!/usr/bin/env node

const { createFileSystem } = require('../filesystem/FileSystemFactory.js');

// Initialize file system abstraction
const fileSystem = createFileSystem();

// Unified theme dictionary with keywords for each theme (same as fetchNews.js)
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
  const title = story.title ? story.title.toLowerCase() : '';
  const summary = story.summary ? story.summary.toLowerCase() : '';
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

// Function to update a single data file
const updateDataFile = async (fileName, forceUpdate = false) => {
  try {
    console.log(`Processing: ${fileName}`);
    
    // Read the existing data
    const content = await fileSystem.read(fileName);
    const data = JSON.parse(content);
    
    if (!data.stories || !Array.isArray(data.stories)) {
      console.log(`  ⚠️  No stories array found in ${fileName}`);
      return false;
    }
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Process each story
    data.stories.forEach((story, index) => {
      if (story.theme && !forceUpdate) {
        // Theme already exists and not forcing update, skip
        skippedCount++;
        return;
      }
      
      // Detect and assign theme
      const detectedTheme = detectStoryTheme(story);
      const oldTheme = story.theme;
      story.theme = detectedTheme;
      updatedCount++;
      
      if (oldTheme && oldTheme !== detectedTheme) {
        console.log(`  Story ${index + 1}: "${story.title.substring(0, 50)}..." → ${oldTheme} → ${detectedTheme}`);
      } else {
        console.log(`  Story ${index + 1}: "${story.title.substring(0, 50)}..." → ${detectedTheme}`);
      }
    });
    
    // Save the updated data back to file
    await fileSystem.write(fileName, JSON.stringify(data, null, 2));
    
    console.log(`  ✅ Updated ${updatedCount} stories, skipped ${skippedCount} (already had themes)`);
    return true;
    
  } catch (error) {
    console.error(`  ❌ Error processing ${fileName}:`, error.message);
    return false;
  }
};

// Main function to process all data files
const updateAllThemes = async (forceUpdate = false) => {
  try {
    console.log('🎨 Starting theme update for all existing data files...\n');
    
    if (forceUpdate) {
      console.log('🔄 Force update mode: Will update all themes regardless of existing values\n');
    }
    
    // Find all JSON files using file system abstraction
    const files = await fileSystem.listFiles();
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      console.log('📂 No JSON files found in data directory');
      process.exit(0);
    }
    
    console.log(`📊 Found ${jsonFiles.length} data files to process:\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each file
    for (const jsonFile of jsonFiles) {
      const success = await updateDataFile(jsonFile.name, forceUpdate);
      
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
      
      console.log(''); // Add spacing between files
    }
    
    // Summary
    console.log('📋 Update Summary:');
    console.log(`   ✅ Successfully updated: ${successCount} files`);
    console.log(`   ❌ Errors encountered: ${errorCount} files`);
    console.log(`   📁 Total files processed: ${jsonFiles.length}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 All themes updated successfully!');
    } else {
      console.log('\n⚠️  Some files had errors. Please check the logs above.');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during theme update:', error.message);
    process.exit(1);
  }
};

// Handle command line execution
if (require.main === module) {
  console.log('🚀 Theme Update Script');
  console.log('======================\n');
  
  // Check for force update flag
  const forceUpdate = process.argv.includes('--force') || process.argv.includes('-f');
  
  updateAllThemes(forceUpdate)
    .then(() => {
      console.log('\n✨ Theme update completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { updateAllThemes, detectStoryTheme };
