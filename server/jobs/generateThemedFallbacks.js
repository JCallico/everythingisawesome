require('dotenv').config();
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

/**
 * Generate themed fallback images using Grok API
 * This script creates multiple fallback images for different themes
 * that will be used when individual story image generation fails.
 */

// Define themes and their corresponding prompts
const THEMES = {
  medical: {
    name: 'Medical/Health',
    prompt: "A bright, modern medical research laboratory with scientists in white coats working on breakthrough treatments, conveying hope and healing. Clean, professional atmosphere with microscopes and medical equipment, soft lighting, inspiring and hopeful mood."
  },
  technology: {
    name: 'Technology/Innovation',
    prompt: "A futuristic, clean technology workspace with innovative devices and digital interfaces, representing progress and innovation. Modern office with sleek computers, holographic displays, bright lighting, inspiring atmosphere of technological advancement."
  },
  education: {
    name: 'Education/Learning',
    prompt: "A bright, inspiring classroom or learning environment with students engaged in discovery, showing growth and achievement. Modern educational setting with books, digital boards, natural lighting, conveying knowledge and academic success."
  },
  environment: {
    name: 'Environment/Nature',
    prompt: "A beautiful, pristine natural landscape showcasing environmental conservation and sustainability, conveying hope for the future. Lush green forest with clean air, flowing water, wildlife, bright sunlight filtering through trees."
  },
  community: {
    name: 'Community/Social',
    prompt: "People coming together in a positive community setting, showing unity, support, and collaborative spirit. Diverse group of people helping each other, warm lighting, smiling faces, sense of togetherness and mutual support."
  },
  science: {
    name: 'Science/Research',
    prompt: "A state-of-the-art research facility with scientists making discoveries, representing breakthrough and progress. Modern laboratory with advanced equipment, researchers at work, clean bright environment, atmosphere of scientific achievement."
  },
  sports: {
    name: 'Sports/Athletics',
    prompt: "An inspiring athletic achievement moment with celebration and triumph, showing human potential and success. Athletes celebrating victory, stadium with cheering crowd, dynamic action, energy and achievement atmosphere."
  },
  arts: {
    name: 'Arts/Culture',
    prompt: "A vibrant, creative artistic scene showcasing cultural expression and creativity, inspiring and uplifting. Art studio with paintings, musical instruments, creative workspace, colorful and inspiring artistic atmosphere."
  },
  general: {
    name: 'General/Default',
    prompt: "A bright, inspiring sunrise over a peaceful landscape with soft, warm light rays breaking through clouds, conveying hope, positivity, and new beginnings. Beautiful natural scene with golden light, peaceful atmosphere, uplifting mood."
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
      model: "grok-2-image",
      prompt: themeData.prompt,
      n: 1,
      response_format: "b64_json"
    }, {
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout
    });

    if (response.data.data && response.data.data.length > 0) {
      const base64Image = response.data.data[0].b64_json;
      
      // Create images directory if it doesn't exist
      const imagesDir = path.join(__dirname, '../../data/generated-images');
      await fs.ensureDir(imagesDir);
      
      // Save as themed fallback image
      const filename = `fallback-${theme}.png`;
      const filepath = path.join(imagesDir, filename);
      const imageBuffer = Buffer.from(base64Image, 'base64');
      await fs.writeFile(filepath, imageBuffer);
      
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
    console.log(`Generating ${Object.keys(THEMES).length} themed fallback images...\n`);

    let successCount = 0;
    let totalCount = Object.keys(THEMES).length;

    for (const [theme, themeData] of Object.entries(THEMES)) {
      const success = await generateFallbackImage(theme, themeData);
      if (success) {
        successCount++;
      }
      
      // Add delay between requests to respect API rate limits
      if (theme !== Object.keys(THEMES)[Object.keys(THEMES).length - 1]) {
        console.log('   ⏱️  Waiting 2 seconds before next generation...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\n✨ === Summary ===');
    console.log(`Successfully generated: ${successCount}/${totalCount} themed fallback images`);
    
    if (successCount === totalCount) {
      console.log('🎉 All themed fallback images generated successfully!');
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
