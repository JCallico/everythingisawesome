import dotenv from 'dotenv';
import { GrokAIService } from './GrokAIService.js';
import { GeminiAIService } from './GeminiAIService.js';

// Load environment variables
dotenv.config();

/**
 * AIServiceFactory
 * Creates the appropriate AI service implementation based on environment configuration
 */

let aiServiceInstance = null;

export function createAIService() {
  // Return singleton instance if already created
  if (aiServiceInstance) {
    return aiServiceInstance;
  }

  const provider = (process.env.AI_PROVIDER || 'grok').toLowerCase();
  
  console.log(`🤖 Initializing AI Service Provider: ${provider}`);

  if (provider === 'gemini') {
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Gemini configuration incomplete: Missing GEMINI_API_KEY');
      console.error('   Falling back to Grok (if available) or failing.');
      // Fallback logic could be complex. For now, let's try to proceed or just throw if strictly requested gemini.
      // But if Grok is the default fallback, let's try that.
      if (process.env.GROK_API_KEY) {
        console.log('   Falling back to Grok AI Service');
        aiServiceInstance = new GrokAIService();
      } else {
        // Neither is configured? The services check internally for keys usually, but factory can pre-check.
        // Let's instantiate Gemini anyway so it throws proper error when used, or throw here.
        aiServiceInstance = new GeminiAIService();
      }
    } else {
      aiServiceInstance = new GeminiAIService();
    }
  } else if (provider === 'grok') {
    // Default to Grok
    aiServiceInstance = new GrokAIService();
  } else {
    console.warn(`⚠️ Unknown AI provider '${provider}', defaulting to Grok`);
    aiServiceInstance = new GrokAIService();
  }

  return aiServiceInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetAIService() {
  aiServiceInstance = null;
}
