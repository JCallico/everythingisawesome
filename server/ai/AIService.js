/**
 * AIService Interface
 * Defines the contract for AI Model interactions
 */
export class AIService {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Returns the name of the AI provider
   * @returns {string} - The provider name (e.g., "Grok", "Gemini")
   */
  getProviderName() {
    throw new Error('Method not implemented');
  }

  /**
   * Returns the model name used
   * @returns {string} - The model identifier
   */
  getModelName() {
    throw new Error('Method not implemented');
  }

  /**
   * Analyzes the sentiment of a text
   * @param {string} text - The text to analyze
   * @returns {Promise<number>} - A score from 0-100
   */
  async analyzeSentiment(text) {
    throw new Error('Method not implemented');
  }

  /**
   * Generates a summary for the given text
   * @param {string} text - The text to summarize
   * @returns {Promise<string>} - The summary
   */
  async generateSummary(text) {
    throw new Error('Method not implemented');
  }

  /**
   * Generates an opinion piece based on an article
   * @param {string} articleUrl - URL of the article
   * @param {string} articleTitle - Title of the article
   * @returns {Promise<string>} - The generated opinion
   */
  async generateOpinion(articleUrl, articleTitle) {
    throw new Error('Method not implemented');
  }

  /**
   * Creates an image generation prompt based on a story
   * @param {Object} story - The story object (must contain title and summary)
   * @returns {Promise<string>} - The image prompt
   */
  async generateImagePrompt(story) {
    throw new Error('Method not implemented');
  }

  /**
   * Generates an image based on a prompt
   * @param {string} prompt - The image generation prompt
   * @returns {Promise<string>} - Base64 encoded image data
   */
  async generateImage(prompt) {
    throw new Error('Method not implemented');
  }
}
