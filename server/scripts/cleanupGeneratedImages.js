#!/usr/bin/env node

import path from 'path';
import { createFileSystem } from '../filesystem/FileSystemFactory.js';
import { fileURLToPath } from 'url';

// ES module equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize file system abstraction
const fileSystem = createFileSystem();

/**
 * Get all JSON files from the data directory using file system abstraction
 */
async function getDataFiles() {
  try {
    const files = await fileSystem.listFiles();
    return files
      .filter(file => file.name.endsWith('.json'))
      .map(file => file.name);
  } catch (error) {
    console.error('Error reading data directory:', error.message);
    return [];
  }
}

/**
 * Extract all image references from news data files using file system abstraction
 */
async function getReferencedImages() {
  const referencedImages = new Set();
  const dataFiles = await getDataFiles();
    
  console.log(`Scanning ${dataFiles.length} data files for image references...`);
    
  for (const fileName of dataFiles) {
    try {
      const content = await fileSystem.read(fileName);
      const data = JSON.parse(content);
            
      if (data.stories && Array.isArray(data.stories)) {
        for (const story of data.stories) {
          if (story.image) {
            // Extract just the filename from the path
            const imageName = path.basename(story.image);
            referencedImages.add(imageName);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing file ${fileName}:`, error.message);
    }
  }
    
  console.log(`Found ${referencedImages.size} referenced images`);
  return referencedImages;
}

/**
 * Get all image files from the generated-images directory using file system abstraction
 */
async function getAllGeneratedImages() {
  try {
    const files = await fileSystem.listFiles('generated-images');
    return files
      .filter(file => 
        file.name.toLowerCase().endsWith('.png') || 
        file.name.toLowerCase().endsWith('.jpg') || 
        file.name.toLowerCase().endsWith('.jpeg') ||
        file.name.toLowerCase().endsWith('.gif') ||
        file.name.toLowerCase().endsWith('.webp')
      )
      .map(file => file.name);
  } catch (error) {
    console.error('Error reading images directory:', error.message);
    return [];
  }
}

/**
 * Find unused images (excluding fallback images) using file system abstraction
 */
async function findUnusedImages() {
  const referencedImages = await getReferencedImages();
  const allImages = await getAllGeneratedImages();
    
  console.log(`Total images in generated-images directory: ${allImages.length}`);
    
  const unusedImages = allImages.filter(image => {
    // Skip any images that start with "fallback"
    if (image.toLowerCase().startsWith('fallback')) {
      return false;
    }
        
    // Check if image is referenced
    return !referencedImages.has(image);
  });
    
  const fallbackCount = allImages.filter(img => img.toLowerCase().startsWith('fallback')).length;
  console.log(`Fallback images (excluded from cleanup): ${fallbackCount}`);
  console.log(`Referenced images: ${referencedImages.size}`);
  console.log(`Unused images found: ${unusedImages.length}`);
    
  return unusedImages;
}

/**
 * Delete unused images using file system abstraction
 */
async function deleteUnusedImages(imagesToDelete) {
  let deletedCount = 0;
  let errors = 0;
    
  for (const image of imagesToDelete) {
    const imagePath = `generated-images/${image}`;
    try {
      await fileSystem.delete(imagePath);
      console.log(`✓ Deleted: ${image}`);
      deletedCount++;
    } catch (error) {
      console.error(`✗ Failed to delete ${image}:`, error.message);
      errors++;
    }
  }
    
  console.log('\nCleanup completed:');
  console.log(`- Images deleted: ${deletedCount}`);
  if (errors > 0) {
    console.log(`- Errors: ${errors}`);
  }
    
  return { deleted: deletedCount, errors };
}

/**
 * Calculate total size of files using file system abstraction
 */
async function calculateTotalSize(imageFiles) {
  let totalSize = 0;
    
  for (const image of imageFiles) {
    try {
      const files = await fileSystem.listFiles('generated-images');
      const fileInfo = files.find(f => f.name === image);
      if (fileInfo) {
        totalSize += fileInfo.size;
      }
    } catch (error) {
      console.warn(`Warning: Could not access file ${image}:`, error.message);
      // Continue with next file
    }
  }
    
  return totalSize;
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
    
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
    
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main cleanup function using file system abstraction
 */
async function cleanupUnusedImages() {
  const args = process.argv.slice(2);
  const whatIf = args.includes('--what-if') || args.includes('-w');
    
  console.log('='.repeat(60));
  console.log('Generated Images Cleanup Script');
  console.log('='.repeat(60));
    
  if (whatIf) {
    console.log('🔍 WHAT-IF MODE: No files will be deleted\n');
  } else {
    console.log('⚠️  DELETION MODE: Files will be permanently deleted\n');
  }
    
  try {
    // Find unused images
    const unusedImages = await findUnusedImages();
    
    if (unusedImages.length === 0) {
      console.log('\n🎉 No unused images found. Nothing to clean up!');
      return;
    }
    
    // Calculate sizes
    const totalSize = await calculateTotalSize(unusedImages);
    const formattedSize = formatBytes(totalSize);
    
    console.log(`\n📋 Found ${unusedImages.length} unused images (${formattedSize}):`);
    
    // Show first few images as examples
    const displayImages = unusedImages.slice(0, 10);
    for (const image of displayImages) {
      console.log(`  - ${image}`);
    }
    
    if (unusedImages.length > 10) {
      console.log(`  ... and ${unusedImages.length - 10} more images`);
    }
    
    if (whatIf) {
      console.log(`\n💡 Run without --what-if to delete these ${unusedImages.length} unused images (${formattedSize})`);
    } else {
      console.log(`\n🗑️  Deleting ${unusedImages.length} unused images...`);
      const result = await deleteUnusedImages(unusedImages);
      
      if (result.deleted > 0) {
        console.log(`\n✅ Successfully cleaned up ${result.deleted} unused images!`);
        if (result.errors === 0) {
          console.log(`💾 Freed up approximately ${formattedSize} of disk space`);
        }
      }
      
      if (result.errors > 0) {
        console.log(`\n⚠️  ${result.errors} errors occurred during cleanup`);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Fatal error during cleanup:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🧹 Generated Images Cleanup Tool');
  console.log('Usage: node cleanupGeneratedImages.js [--what-if|-w]');
  console.log('');
  
  cleanupUnusedImages()
    .then(() => {
      console.log('\n✨ Cleanup script completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error.message);
      process.exit(1);
    });
}

export { cleanupUnusedImages, findUnusedImages, getReferencedImages };
