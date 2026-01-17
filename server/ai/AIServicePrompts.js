/**
 * AI Service Prompts
 * Centralized prompts for AI services to ensure consistency across different providers.
 */

export const getSentimentAnalysisPrompt = (articleText) => `Analyze this news article and provide a positivity score from 0-100 based on genuine human interest and inspiring content.

SCORING GUIDELINES:
- 80-100: Genuine positive outcomes - scientific breakthroughs, successful rescues, medical cures, achievements, environmental victories, community successes, heroic acts, charitable accomplishments
- 40-79: General positive news without major impact  
- 20-39: Neutral or mixed content
- 0-19: Negative events, crimes, disasters, failures, product sales, commercial content

CRITICAL: Focus on the MAIN EVENT, not just positive entities mentioned:
- If the primary news is negative (scams, crimes, disasters, deaths, failures) → Score 0-19 even if good organizations are mentioned
- If the primary news is positive (successes, breakthroughs, rescues, achievements) → Score based on impact

NEGATIVE INDICATORS (Score 0-19):
- Crimes, scams, fraud, theft, corruption
- Disasters, accidents, emergencies, crises
- Deaths, injuries, illnesses, setbacks
- Product sales, deals, discounts, shopping content
- Commercial promotions, advertisements
- Failures, controversies, conflicts

POSITIVE INDICATORS (Score 80-100):
- Scientific discoveries, medical breakthroughs
- Successful rescues, heroic acts, lives saved
- Community achievements, charitable successes
- Environmental victories, conservation wins
- Educational breakthroughs, accessibility improvements
- Inspirational human stories with positive outcomes

EXCEPTION: Charity fundraising events and donation drives should score highly even if they mention prices.

Article text: "${articleText.substring(0, 1000)}"

Respond with only a number between 0-100 representing the positivity score.`;

export const getSummaryPrompt = (articleText) => `Create a concise, positive summary (2-3 sentences) for this news article, highlighting its most inspiring and uplifting aspects:

Article: "${articleText.substring(0, 1000)}"

Focus on the positive impact, hope, and inspiring elements. Keep it under 200 characters.`;

export const getOpinionPrompt = (articleUrl, articleTitle) => `Retrieve and analyze this article: "${articleUrl}"
Title: "${articleTitle || ''}"

Write a sharp, highly opinionated commentary on this topic. Do NOT just summarize the article. 
Express a strong, distinctive viewpoint based on the news and your broader knowledge of the subject.
- Be bold, decisive, and insightful. 
- Avoid neutral language, hedging, or generic "both sides" arguments.
- If the story is inspiring, explain exactly why it's a game-changer with enthusiasm.
- If it raises questions or feels performative, critically analyze it.
- Your context: You are an expert observer providing a "Hot Take" that provokes thought.

Output only a single, compelling paragraph with your distinct opinion.`;

export const getImageGenerationPrompt = (story) => `Based on this uplifting news story, create a detailed, visual description for an AI image generator. The description should be positive, inspiring, and capture the essence of the story. Focus on creating a professional, high-quality image that represents the story's theme.

Story Title: "${story.title}"
Story Summary: "${story.summary}"

Create a visual description that includes:
- The main theme or subject matter
- Positive, uplifting atmosphere
- Professional, clean aesthetic
- Inspiring visual elements
- No text or words visible in the image
- Photorealistic or artistic style as appropriate
- Vertical/Portrait composition (3:4 aspect ratio)

Respond with only the image generation prompt (max 300 characters).`;
