require('dotenv').config();
const axios = require('axios');
const path = require('path');
const { createFileSystem } = require('../filesystem/FileSystemFactory.js');

// Initialize file system abstraction
const fileSystem = createFileSystem();

/**
 * Generate themed fallback images using Grok API
 * This script creates multiple fallback images for different themes
 * that will be used when individual story image generation fails.
 */

// Define themes and their corresponding prompts (unified with theme system)
const THEMES = {
  health: {
    name: 'Health/Medical',
    prompt: 'A bright, modern medical research laboratory with scientists in white coats working on breakthrough treatments, conveying hope and healing. Clean, professional atmosphere with microscopes and medical equipment, soft lighting, inspiring and hopeful mood.'
  },
  nature: {
    name: 'Nature/Environment',
    prompt: 'A beautiful, pristine natural landscape showcasing environmental conservation and sustainability, conveying hope for the future. Lush green forest with clean air, flowing water, wildlife, bright sunlight filtering through trees.'
  },
  innovation: {
    name: 'Innovation/Technology',
    prompt: 'A futuristic, clean technology workspace with innovative devices and digital interfaces, representing progress and innovation. Modern office with sleek computers, holographic displays, bright lighting, inspiring atmosphere of technological advancement.'
  },
  community: {
    name: 'Community/Social',
    prompt: 'People coming together in a positive community setting, showing unity, support, and collaborative spirit. Diverse group of people helping each other, warm lighting, smiling faces, sense of togetherness and mutual support.'
  },
  education: {
    name: 'Education/Learning',
    prompt: 'A bright, inspiring classroom or learning environment with students engaged in discovery, showing growth and achievement. Modern educational setting with books, digital boards, natural lighting, conveying knowledge and academic success.'
  },
  sports: {
    name: 'Sports/Athletics',
    prompt: 'An inspiring athletic achievement moment with a team celebration and triumph, showing human potential and success. Diverse athletes from different parts of the world in the same team celebrating victory, stadium with cheering crowd, dynamic action, energy and achievement atmosphere.'
  },
  science: {
    name: 'Science/Research',
    prompt: 'A state-of-the-art research facility with scientists making discoveries, representing breakthrough and progress. Modern laboratory with advanced equipment, researchers at work, clean bright environment, atmosphere of scientific achievement.'
  },
  arts: {
    name: 'Arts/Culture',
    prompt: 'A vibrant, creative artistic scene showcasing cultural expression and creativity, inspiring and uplifting. Art studio with paintings, musical instruments, creative workspace, colorful and inspiring artistic atmosphere.'
  },
  business: {
    name: 'Business/Finance',
    prompt: 'A modern, successful business environment with professionals collaborating on innovative projects, representing growth and achievement. Clean office space with charts showing positive trends, natural lighting, atmosphere of success and progress.'
  },
  entertainment: {
    name: 'Entertainment/Media',
    prompt: 'A vibrant entertainment venue with performances and creative expression, showcasing joy and artistic achievement. Theater or concert hall with warm lighting, celebrating human creativity and cultural expression.'
  },
  travel: {
    name: 'Travel/Adventure',
    prompt: 'A breathtaking travel destination showcasing natural beauty and adventure, inspiring wanderlust and discovery. Scenic landscape with mountains, clear skies, peaceful atmosphere, conveying exploration and positive experiences.'
  },
  food: {
    name: 'Food/Cuisine',
    prompt: 'A beautifully presented culinary scene with fresh, colorful ingredients and artistic food presentation, celebrating culinary arts and nourishment. Professional kitchen or elegant dining setting with natural lighting, appetizing and inspiring.'
  },
  lifestyle: {
    name: 'Lifestyle/Wellness',
    prompt: 'A serene wellness and lifestyle scene promoting health and well-being, showcasing balance and positive living. Peaceful setting with elements of self-care, natural lighting, calming atmosphere, inspiring healthy living.'
  },
  politics: {
    name: 'Politics/Governance',
    prompt: 'A dignified government building or civic space representing democratic values and positive governance, conveying stability and progress. Clean architectural design with inspiring elements, professional atmosphere of public service.'
  },
  economy: {
    name: 'Economy/Financial',
    prompt: 'A modern financial district with tall buildings and positive economic indicators, representing growth and prosperity. Clean urban environment with architectural elements suggesting stability and economic progress.'
  },
  world: {
    name: 'World/International',
    prompt: 'A beautiful global scene showing international cooperation and cultural diversity, representing unity and worldwide positive change. Earth from space or diverse cultural landmarks, inspiring sense of global community.'
  },
  inspiring: {
    name: 'Inspiring/Uplifting',
    prompt: 'A bright, inspiring sunrise over a peaceful landscape with soft, warm light rays breaking through clouds, conveying hope, positivity, and new beginnings. Beautiful natural scene with golden light, peaceful atmosphere, uplifting mood.'
  },
  hope: {
    name: 'Hope/General',
    prompt: 'A bright, inspiring sunrise over a peaceful landscape with soft, warm light rays breaking through clouds, conveying hope, positivity, and new beginnings. Beautiful natural scene with golden light, peaceful atmosphere, uplifting mood.'
  }
};

const generateFallbackImage = async (theme, themeData) => {
  try {
    const grokApiKey = process.env.GROK_API_KEY;
    if (!grokApiKey) {
      throw new Error('GROK_API_KEY not found in environment variables');
    }

    console.log(`🎨 Generating ${themeData.name} fallback image...`);
    console.log(`   Using prompt: "${themeData.prompt}"`);

    const response = await axios.post('https://api.x.ai/v1/images/generations', {
      model: process.env.GROK_IMAGE_MODEL || 'grok-2-image',
      prompt: themeData.prompt,
      n: 1,
      response_format: 'b64_json'
    }, {
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout
    });

    if (response.data.data && response.data.data.length > 0) {
      const base64Image = response.data.data[0].b64_json;
      
      // Save as themed fallback image using file system abstraction
      const filename = `fallback-${theme}.png`;
      const filepath = `generated-images/${filename}`;
      const imageBuffer = Buffer.from(base64Image, 'base64');
      await fileSystem.write(filepath, imageBuffer);
      
      console.log(`   ✅ ${themeData.name} fallback image saved: ${filename}`);
      return true;
    } else {
      console.error(`   ❌ No image data received for ${themeData.name} theme`);
      return false;
    }
  } catch (error) {
    console.error(`   ❌ Error generating ${themeData.name} fallback image:`, error.message);
    if (error.response && error.response.data) {
      console.error('      API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
};

const generateAllFallbackImages = async () => {
  try {
    console.log('🚀 === Themed Fallback Image Generator ===');
    console.log('This script will generate themed fallback images using Grok API');
    console.log('Only missing fallback images will be generated...\n');

    let successCount = 0;
    let skippedCount = 0;
    const totalCount = Object.keys(THEMES).length;
    let toGenerateCount = 0;

    // First, check which images need to be generated
    const themesToGenerate = [];
    for (const [theme, themeData] of Object.entries(THEMES)) {
      const filename = `fallback-${theme}.png`;
      const filepath = `generated-images/${filename}`;
      
      if (await fileSystem.exists(filepath)) {
        console.log(`✅ ${themeData.name} fallback image already exists: ${filename}`);
        skippedCount++;
      } else {
        console.log(`🆕 ${themeData.name} fallback image needs to be generated: ${filename}`);
        themesToGenerate.push([theme, themeData]);
        toGenerateCount++;
      }
    }

    if (toGenerateCount === 0) {
      console.log('\n🎉 All themed fallback images already exist! No generation needed.');
      return true;
    }

    console.log(`\n📊 Summary: ${skippedCount} existing, ${toGenerateCount} to generate\n`);

    // Generate only the missing images
    for (let i = 0; i < themesToGenerate.length; i++) {
      const [theme, themeData] = themesToGenerate[i];
      const success = await generateFallbackImage(theme, themeData);
      if (success) {
        successCount++;
      }
      
      // Add delay between requests to respect API rate limits (except for last one)
      if (i < themesToGenerate.length - 1) {
        console.log('   ⏱️  Waiting 2 seconds before next generation...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\n✨ === Final Summary ===');
    console.log(`Successfully generated: ${successCount}/${toGenerateCount} new fallback images`);
    console.log(`Already existed: ${skippedCount} fallback images`);
    console.log(`Total: ${successCount + skippedCount}/${totalCount} themed fallback images available`);
    
    if (successCount === toGenerateCount) {
      console.log('🎉 All missing themed fallback images generated successfully!');
      console.log('📝 The themed fallback images are now ready for use in your application.');
      return true;
    } else {
      console.log('⚠️  Some fallback images failed to generate. Check the errors above.');
      return false;
    }

  } catch (error) {
    console.error('❌ Error in generateAllFallbackImages:', error.message);
    return false;
  }
};

// Run the script if called directly
if (require.main === module) {
  generateAllFallbackImages().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { generateAllFallbackImages, generateFallbackImage, THEMES };
