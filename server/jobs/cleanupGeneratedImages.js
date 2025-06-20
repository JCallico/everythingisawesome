#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_DIR = path.join(__dirname, '../../data');
const IMAGES_DIR = path.join(__dirname, '../../data/generated-images');

/**
 * Get all JSON files from the data directory
 */
function getDataFiles() {
    try {
        const files = fs.readdirSync(DATA_DIR);
        return files
            .filter(file => file.endsWith('.json'))
            .map(file => path.join(DATA_DIR, file));
    } catch (error) {
        console.error('Error reading data directory:', error.message);
        return [];
    }
}

/**
 * Extract all image references from news data files
 */
function getReferencedImages() {
    const referencedImages = new Set();
    const dataFiles = getDataFiles();
    
    console.log(`Scanning ${dataFiles.length} data files for image references...`);
    
    for (const filePath of dataFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
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
            console.error(`Error processing file ${filePath}:`, error.message);
        }
    }
    
    console.log(`Found ${referencedImages.size} referenced images`);
    return referencedImages;
}

/**
 * Get all image files from the generated-images directory
 */
function getAllGeneratedImages() {
    try {
        const files = fs.readdirSync(IMAGES_DIR);
        return files.filter(file => 
            file.toLowerCase().endsWith('.png') || 
            file.toLowerCase().endsWith('.jpg') || 
            file.toLowerCase().endsWith('.jpeg') ||
            file.toLowerCase().endsWith('.gif') ||
            file.toLowerCase().endsWith('.webp')
        );
    } catch (error) {
        console.error('Error reading images directory:', error.message);
        return [];
    }
}

/**
 * Find unused images (excluding fallback images)
 */
function findUnusedImages() {
    const referencedImages = getReferencedImages();
    const allImages = getAllGeneratedImages();
    
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
 * Delete unused images
 */
function deleteUnusedImages(imagesToDelete) {
    let deletedCount = 0;
    let errors = 0;
    
    for (const image of imagesToDelete) {
        const imagePath = path.join(IMAGES_DIR, image);
        try {
            fs.unlinkSync(imagePath);
            console.log(`✓ Deleted: ${image}`);
            deletedCount++;
        } catch (error) {
            console.error(`✗ Failed to delete ${image}:`, error.message);
            errors++;
        }
    }
    
    console.log(`\nCleanup completed:`);
    console.log(`- Images deleted: ${deletedCount}`);
    if (errors > 0) {
        console.log(`- Errors: ${errors}`);
    }
    
    return { deleted: deletedCount, errors };
}

/**
 * Calculate total size of files
 */
function calculateTotalSize(imageFiles) {
    let totalSize = 0;
    
    for (const image of imageFiles) {
        try {
            const imagePath = path.join(IMAGES_DIR, image);
            const stats = fs.statSync(imagePath);
            totalSize += stats.size;
        } catch (error) {
            // Skip files that can't be accessed
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
 * Main function
 */
function main() {
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
    
    // Check if directories exist
    if (!fs.existsSync(DATA_DIR)) {
        console.error(`Data directory not found: ${DATA_DIR}`);
        process.exit(1);
    }
    
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`Images directory not found: ${IMAGES_DIR}`);
        process.exit(1);
    }
    
    // Find unused images
    const unusedImages = findUnusedImages();
    
    if (unusedImages.length === 0) {
        console.log('\n🎉 No unused images found. Nothing to clean up!');
        return;
    }
    
    // Calculate space that would be freed
    const totalSize = calculateTotalSize(unusedImages);
    console.log(`\nSpace that would be freed: ${formatBytes(totalSize)}`);
    
    if (whatIf) {
        console.log('\n📋 Images that would be deleted:');
        console.log('-'.repeat(40));
        unusedImages.forEach((image, index) => {
            console.log(`${index + 1}. ${image}`);
        });
        console.log('\n💡 Run without --what-if to actually delete these files');
    } else {
        console.log('\n🗑️  Deleting unused images...');
        console.log('-'.repeat(40));
        deleteUnusedImages(unusedImages);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    getReferencedImages,
    findUnusedImages,
    deleteUnusedImages
};
