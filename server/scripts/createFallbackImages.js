#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// All themes that need fallback images
const ALL_THEMES = [
  'health',
  'nature', 
  'innovation',
  'community',
  'education',
  'sports',
  'science',
  'arts',
  'business',
  'entertainment',
  'travel',
  'food',
  'lifestyle',
  'politics',
  'economy',
  'world',
  'inspiring',
  'hope'
];

// Map themes to existing fallback images (for copying)
const EXISTING_FALLBACKS = {
  'health': 'fallback-medical.png',
  'nature': 'fallback-environment.png',
  'innovation': 'fallback-technology.png',
  'community': 'fallback-community.png',
  'education': 'fallback-education.png',
  'sports': 'fallback-sports.png',
  'science': 'fallback-science.png',
  'arts': 'fallback-arts.png'
};

async function createMissingFallbackImages() {
  const imagesDir = path.join(__dirname, '../../data/generated-images');
  
  console.log('🎨 Creating missing fallback images for all themes...\n');
  
  let createdCount = 0;
  let skippedCount = 0;
  
  for (const theme of ALL_THEMES) {
    const targetFile = path.join(imagesDir, `fallback-${theme}.png`);
    
    // Check if fallback image already exists
    if (await fs.pathExists(targetFile)) {
      console.log(`  ✅ fallback-${theme}.png already exists`);
      skippedCount++;
      continue;
    }
    
    // Determine source image to copy from
    let sourceFile;
    if (EXISTING_FALLBACKS[theme]) {
      sourceFile = path.join(imagesDir, EXISTING_FALLBACKS[theme]);
    } else {
      // Use general fallback for themes without specific images
      sourceFile = path.join(imagesDir, 'fallback-general.png');
    }
    
    // Copy the source image to create the new fallback
    if (await fs.pathExists(sourceFile)) {
      await fs.copy(sourceFile, targetFile);
      console.log(`  📋 Created fallback-${theme}.png (copied from ${path.basename(sourceFile)})`);
      createdCount++;
    } else {
      console.log(`  ⚠️  Could not create fallback-${theme}.png (source not found: ${path.basename(sourceFile)})`);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   ✅ Created: ${createdCount} new fallback images`);
  console.log(`   ⏭️  Skipped: ${skippedCount} existing images`);
  console.log(`   📁 Total themes: ${ALL_THEMES.length}`);
  
  if (createdCount > 0) {
    console.log('\n🎉 All fallback images are now available!');
  } else {
    console.log('\n✨ All fallback images were already present!');
  }
}

// Handle command line execution
if (require.main === module) {
  console.log('🚀 Fallback Image Creator');
  console.log('========================\n');
  
  createMissingFallbackImages()
    .then(() => {
      console.log('\n✨ Fallback image creation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { createMissingFallbackImages };
