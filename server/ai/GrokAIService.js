import axios from 'axios';
import { AIService } from './AIService.js';
import { 
  getSentimentAnalysisPrompt, 
  getSummaryPrompt, 
  getOpinionPrompt, 
  getImageGenerationPrompt 
} from './AIServicePrompts.js';

export class GrokAIService extends AIService {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.apiKey || process.env.GROK_API_KEY;
    this.apiUrl = config.apiUrl || 'https://api.x.ai/v1/chat/completions';
    this.imageModel = config.imageModel || process.env.GROK_IMAGE_MODEL || 'grok-2-image';
    this.model = config.model || process.env.GROK_MODEL || 'grok-3-latest';
  }

  getProviderName() {
    return 'Grok';
  }

  getModelName() {
    return this.model;
  }

  async analyzeSentiment(articleText, retries = 3) {
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY not found');
    }

    const prompt = getSentimentAnalysisPrompt(articleText);

    try {
      const response = await axios.post(this.apiUrl, {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: parseInt(process.env.GROK_SENTIMENT_MAX_TOKENS) || 10
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const content = response.data.choices[0].message.content.trim();
      const score = parseInt(content);
      
      if (isNaN(score) || score < 0 || score > 100) {
        throw new Error('Invalid sentiment score received');
      }
      
      return score;
    } catch (error) {
      console.error('Error analyzing sentiment (Grok):', error.message);
      if (retries > 0) {
        console.log(`Retrying sentiment analysis... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await this.analyzeSentiment(articleText, retries - 1);
      }
      throw error;
    }
  }

  async generateSummary(articleText, retries = 3) {
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY not found');
    }

    const prompt = getSummaryPrompt(articleText);

    try {
      const response = await axios.post(this.apiUrl, {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: parseInt(process.env.GROK_SUMMARY_MAX_TOKENS) || 100
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating summary (Grok):', error.message);
      if (retries > 0) {
        console.log(`Retrying summary generation... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await this.generateSummary(articleText, retries - 1);
      }
      throw error;
    }
  }

  async generateOpinion(articleUrl, articleTitle, retries = 3) {
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY not found');
    }

    const prompt = getOpinionPrompt(articleUrl, articleTitle);

    try {
      const response = await axios.post(this.apiUrl, {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: parseInt(process.env.GROK_OPINION_MAX_TOKENS) || 300
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const opinion = response.data.choices[0].message.content.trim();
      if (!opinion) {
        throw new Error('Empty opinion received from Grok API');
      }
      return opinion;
    } catch (error) {
      console.error('Error generating opinion (Grok):', error.message);
      if (retries > 0) {
        console.log(`Retrying opinion generation... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await this.generateOpinion(articleUrl, articleTitle, retries - 1);
      }
      // If strict mode, throw, but in fetchNews it returned empty string. 
      // I'll throw and let the caller handle fallback to empty string if they want.
      throw error;
    }
  }

  async generateImagePrompt(story) {
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY not found');
    }

    const prompt = getImageGenerationPrompt(story);

    try {
      const response = await axios.post(this.apiUrl, {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: parseInt(process.env.GROK_IMAGE_PROMPT_MAX_TOKENS) || 150
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const generatedPrompt = response.data.choices[0].message.content.trim();
      return generatedPrompt
        .replace(/['"]/g, '')
        .replace(/\n/g, ' ')
        .substring(0, 500);
    } catch (error) {
      console.error('Error creating image prompt (Grok):', error.message);
      throw error;
    }
  }

  async generateImage(prompt) {
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY not found');
    }

    try {
      const response = await axios.post('https://api.x.ai/v1/images/generations', {
        model: this.imageModel,
        prompt: prompt,
        n: 1,
        response_format: 'b64_json'
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0].b64_json;
      }
      throw new Error('No image data returned from Grok');
    } catch (error) {
      console.error('Error generating image (Grok):', error.message);
      throw error;
    }
  }
}
