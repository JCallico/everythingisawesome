require('dotenv').config();
const axios = require('axios');
const moment = require('moment');
const { saveNewsByDate, formatDateForFilename, getPreviousDate } = require('../utils/newsUtils');
const fs = require('fs-extra');
const path = require('path');

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

const fetchDailyNews = async () => {
  try {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      console.error('GROK_API_KEY not found in environment variables');
      return false;
    }

    const yesterday = getPreviousDate(new Date());
    const formattedDate = moment(yesterday).format('MMMM Do, YYYY');
    
    // Read the example.json as template
    const examplePath = path.join(__dirname, '../../example.json');
    let exampleContent = '';
    
    try {
      const example = await fs.readJson(examplePath);
      exampleContent = JSON.stringify(example, null, 2);
    } catch (error) {
      console.log('Could not read example.json, using basic template');
    }

    const prompt = `Do a deep research and choose the top 10 most optimistic, feel good, awe inspiring news of ${formattedDate}. The kind of news that restore your hope in humanity and makes you feel good about the human race. 

Focus on stories about:
- Scientific breakthroughs that help humanity
- Environmental protection and restoration
- Acts of kindness and compassion
- Educational and social progress
- Medical advances
- Community initiatives
- Cultural celebrations
- Innovation for good
- Human resilience and triumph

Format the results as JSON with this exact structure:
{
  "date": "${yesterday}",
  "title": "Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories",
  "stories": [
    {
      "title": "Story title",
      "summary": "Brief positive summary highlighting the inspiring aspect",
      "link": "https://actual-news-source-url.com",
      "awesome_index": 95
    }
  ]
}

The awesome_index should range from 50-100, with the most inspiring stories getting higher scores. Ensure all links are real and functional news sources. Return only the JSON, no additional text.`;

    const response = await axios.post(GROK_API_URL, {
      model: 'grok-2-latest',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    
    // Try to parse the JSON response
    let newsData;
    try {
      // Clean up the response in case it has markdown formatting
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      newsData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing API response as JSON:', parseError);
      console.log('Raw response:', content);
      return false;
    }

    // Validate the structure
    if (!newsData.date || !newsData.stories || !Array.isArray(newsData.stories)) {
      console.error('Invalid news data structure received from API');
      return false;
    }

    // Save the news data
    const success = await saveNewsByDate(yesterday, newsData);
    
    if (success) {
      console.log(`Successfully fetched and saved news for ${yesterday}`);
      return true;
    } else {
      console.error('Failed to save news data');
      return false;
    }

  } catch (error) {
    console.error('Error fetching daily news:', error);
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    }
    return false;
  }
};

// Allow manual execution
if (require.main === module) {
  console.log('Manually fetching daily news...');
  fetchDailyNews().then(success => {
    if (success) {
      console.log('News fetch completed successfully');
    } else {
      console.log('News fetch failed');
    }
    process.exit(success ? 0 : 1);
  });
}

module.exports = { fetchDailyNews };
