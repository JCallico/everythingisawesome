import axios from 'axios';
import { AIService } from './AIService.js';
import { 
  getSentimentAnalysisPrompt, 
  getSummaryPrompt, 
  getOpinionPrompt, 
  getImageGenerationPrompt 
} from './AIServicePrompts.js';

export class GeminiAIService extends AIService {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY;
    this.model = config.model || process.env.GEMINI_MODEL || 'gemini-flash-latest'; 
    this.imageModel = config.imageModel || process.env.GEMINI_IMAGE_MODEL || 'gemini-2.0-flash-exp';   
  }

  getProviderName() {
    return 'Gemini';
  }

  getModelName() {
    return this.model;
  }

  async _generateContent(prompt, maxTokens = null, temperature = 0.7) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    
    const generationConfig = {
      temperature: temperature
    };
    
    if (maxTokens) {
      generationConfig.maxOutputTokens = maxTokens;
    }

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: generationConfig
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && 
          response.data.candidates && 
          response.data.candidates.length > 0 && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts.length > 0) {
        
        return response.data.candidates[0].content.parts[0].text.trim();
      }
      
      console.log('DEBUG: Unexpected Gemini response:', JSON.stringify(response.data, null, 2));
      throw new Error('Unexpected response format from Gemini API');
    } catch (error) {
      console.error('Error calling Gemini API:', error.message);
      if (error.response) {
        console.error('Gemini API Error Response:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  async analyzeSentiment(articleText, retries = 3) {
    const prompt = getSentimentAnalysisPrompt(articleText);

    try {
      // Significantly increased token limit to accommodate reasoning/thinking models
      const maxTokens = parseInt(process.env.GEMINI_SENTIMENT_MAX_TOKENS) || 20;
      const content = await this._generateContent(prompt, maxTokens, 0.3);
      const score = parseInt(content);
      
      if (isNaN(score) || score < 0 || score > 100) {
        throw new Error('Invalid sentiment score received');
      }
      
      return score;
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying sentiment analysis (Gemini)... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await this.analyzeSentiment(articleText, retries - 1);
      }
      // Re-throw to let caller handle fallback
      throw error;
    }
  }

  async generateSummary(articleText, retries = 3) {
    const prompt = getSummaryPrompt(articleText);

    try {
      const maxTokens = parseInt(process.env.GEMINI_SUMMARY_MAX_TOKENS) || 200;
      return await this._generateContent(prompt, maxTokens, 0.7);
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying summary generation (Gemini)... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await this.generateSummary(articleText, retries - 1);
      }
      throw error;
    }
  }

  async generateOpinion(articleUrl, articleTitle, retries = 3) {
    const prompt = getOpinionPrompt(articleUrl, articleTitle);

    try {
      const maxTokens = parseInt(process.env.GEMINI_OPINION_MAX_TOKENS) || 500;
      const opinion = await this._generateContent(prompt, maxTokens, 0.8);
      if (!opinion) throw new Error('Empty opinion received');
      return opinion;
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying opinion generation (Gemini)... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await this.generateOpinion(articleUrl, articleTitle, retries - 1);
      }
      throw error;
    }
  }

  async generateImagePrompt(story) {
    const prompt = getImageGenerationPrompt(story);

    try {
      const maxTokens = parseInt(process.env.GEMINI_IMAGE_PROMPT_MAX_TOKENS) || 300;
      const generatedPrompt = await this._generateContent(prompt, maxTokens, 0.7);
      return generatedPrompt
        .replace(/['"]/g, '')
        .replace(/\n/g, ' ')
        .substring(0, 500);
    } catch (error) {
      console.error('Error creating image prompt (Gemini):', error.message);
      throw error;
    }
  }

  async generateImage(prompt) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.imageModel}:generateContent?key=${this.apiKey}`;
    
    // enhance prompt with aspect ratio instruction for Gemini
    const enhancedPrompt = `${prompt}, aspect ratio 3:4, portrait, high quality`;

    const payload = {
      contents: [{
        parts: [{ text: enhancedPrompt }]
      }]
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData) {
              return part.inlineData.data; // Base64 string
            }
          }
        }
      }
       
      throw new Error(`No inline image data returned from Gemini Model (${this.imageModel})`);
    } catch (error) {
      console.error(`Error generating image with Gemini (${this.imageModel}):`, error.message);
      if (error.response) {
        console.error('Gemini Image API Error details:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }
}
