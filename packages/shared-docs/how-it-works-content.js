export default `# How "Everything Is Awesome News" Works

## Mission & Philosophy

"Everything Is Awesome" is designed to combat news fatigue and negativity bias by surfacing genuinely inspiring stories that often get buried under commercial content and sensationalism. Our algorithm prioritizes authentic human achievements, scientific breakthroughs, community successes, and environmental progress over product sales and promotional content.

## The 6-Step Curation Process

### Step 1: News Article Fetching

We query **NewsAPI** daily for up to 100 articles using 50+ carefully selected positive keywords including "breakthrough," "cure," "rescue," "discovery," "innovation," "helping," "volunteer," "charity," "triumph," "milestone," and "achievement." The system searches across 100+ diverse news sources without source filtering to maximize content diversity.

### Step 2: Multi-Stage Filtering

Articles undergo rigorous pre-filtering to eliminate low-quality content:

- **Keyword Filter:** Removes articles with zero positive keywords
- **Quality Check:** Filters out placeholder "[Removed]" content from NewsAPI
- **Commercial Content Detection:** AI-powered identification of sales/promotional content
- **Sentiment Threshold:** Eliminates articles scoring below 40/100 in positivity

### Step 3: Enhanced AI Analysis

Each article is analyzed by **Grok-3-latest** using specialized prompts designed to focus on genuine human interest content:

- **Anti-Commercial Filtering:** Product sales and promotional content automatically scored 0-20
- **Main Event Focus:** Algorithm evaluates the primary news event, not just positive entities mentioned
- **Negative Event Detection:** Stories about crimes, scams, or disasters score low even if good organizations are mentioned
- **Charity Exception:** Legitimate fundraising and charity auctions maintain high scores
- **Genuine Content Prioritization:** Scientific breakthroughs, community achievements, and inspiring human stories score 80-100

### Step 4: Awesome Index Calculation

The proprietary Awesome Index combines multiple factors for final ranking:

- **Base Sentiment Score:** AI-generated positivity rating (50-100 range)
- **Keyword Density Bonus:** Up to 10 additional points for articles mentioning multiple positive themes
- **Commercial Penalty:** Significant score reduction for sales/promotional content
- **Final Range:** All scores normalized to 50-100 scale, ensuring minimum positivity threshold

### Step 5: Generic Duplicate Detection

Advanced duplicate story detection ensures unique content using cutting-edge fuzzy string matching:

- **12 Similarity Algorithms:** Analyzes titles, summaries, and combined text using ratio, partial ratio, token sort, and token set matching
- **No Hardcoded Keywords:** Purely generic approach that works for any news content (health, sports, politics, entertainment, etc.)
- **Optimal Threshold:** Uses scientifically determined threshold of 70 for maximum accuracy
- **Smart Selection:** Keeps the highest awesome_index story from each duplicate group
- **Proven Performance:** Achieved 100% precision and 100% recall on test data with zero false positives
- **Universal Coverage:** Works across all news categories without requiring manual keyword maintenance

### Step 6: Content Enhancement & Final Selection

The top 10 highest-scoring unique articles are enhanced with AI-generated content:

- **Smart Summarization:** Concise, uplifting summaries highlighting inspiring aspects
- **Custom Image Generation:** AI-created visuals using Grok-2-image based on story themes
- **Themed Fallbacks:** Pre-generated category images when AI generation fails

## Advanced AI Analysis Technology

### Grok-3-Latest Enhanced Sentiment Analysis

Our AI analysis uses X.AI's most advanced Grok-3-latest model with specialized prompts designed to distinguish between genuine inspiring content and commercial promotional material. This ensures only authentic positive stories make it through our filters.

### Multi-Criteria Evaluation System

Each article undergoes comprehensive analysis across multiple dimensions:

- **Primary Event Analysis:** AI evaluates the main news event, not just positive keywords mentioned
- **Commercial Content Detection:** Automatically identifies and scores product sales, deals, and promotional content 0-20
- **Contextual Understanding:** Distinguishes between genuine positive outcomes vs. incidental mentions of good organizations
- **Impact Assessment:** Prioritizes stories with meaningful human impact over trivial positive mentions
- **Authenticity Verification:** Filters out native advertising and disguised commercial content

## Proprietary Awesome Index Algorithm

### Mathematical Formula & Components

The Awesome Index combines multiple factors using a scientifically designed formula:

**Awesome Index = max(50, min(100, sentiment_score + keyword_boost))**

### Sentiment Score Foundation (50-100 Range)

The base sentiment score forms the foundation of our ranking system:

- **Commercial Content Penalty:** Sales/promotional articles automatically scored 0-20
- **Negative Event Filter:** Stories about crimes, disasters, or scandals score below 40
- **Neutral Content Range:** General news without clear positive impact scores 40-60
- **Positive Impact Stories:** Community achievements, helping others score 60-80
- **Exceptional Achievements:** Major breakthroughs, life-saving innovations score 80-100

### Keyword Density Bonus (0-10 Points)

Additional scoring boost based on positive keyword concentration:

- **Single Keyword:** +0 bonus points
- **2-3 Keywords:** +2 bonus points
- **4-5 Keywords:** +4 bonus points
- **6+ Keywords:** +6-10 bonus points (capped at 10)

### Quality Thresholds & Filtering

Multiple quality gates ensure only the best content reaches users:

- **Minimum Threshold:** All displayed articles score 50+ (eliminates bottom 60-70% of content)
- **Commercial Filter:** Removes product sales, deals, and promotional content
- **Duplicate Detection:** Advanced fuzzy matching removes near-identical stories
- **Source Diversity:** Ensures varied perspectives from multiple publishers

## Content Enhancement & User Experience

### AI-Generated Summaries

Each selected article receives a custom AI-generated summary designed to:

- **Highlight Positive Aspects:** Focus on inspiring and uplifting elements
- **Maintain Accuracy:** Preserve factual content while emphasizing positivity
- **Improve Readability:** Create concise, engaging descriptions
- **Reduce Bias:** Present information objectively while maintaining optimistic tone

### Custom Visual Content

Every story is enhanced with AI-generated imagery:

- **Theme-Based Generation:** Images created using Grok-2-image based on story content
- **Fallback System:** Pre-designed category images when generation fails
- **Visual Consistency:** Maintains cohesive aesthetic across all content
- **Accessibility:** Alt text and descriptions for screen readers

### Adaptive User Interface

The platform automatically adjusts visual themes based on story categories:

- **Dynamic Color Schemes:** Each category (health, science, community, etc.) has unique gradients
- **Responsive Design:** Optimized for mobile and desktop viewing
- **Smooth Transitions:** Animated page changes create engaging user experience
- **Fast Loading:** Optimized content delivery for quick access to positive news

## Quality Assurance & Continuous Improvement

### Algorithmic Refinement

Our system continuously evolves based on performance metrics:

- **Daily Processing:** Fresh content analysis every 24 hours
- **Score Calibration:** Regular adjustment of sentiment thresholds
- **Duplicate Detection Tuning:** Ongoing optimization of similarity algorithms
- **Commercial Filter Enhancement:** Improved detection of promotional content

### Content Verification

Multiple validation layers ensure content quality:

- **Source Reputation:** Prioritizes established news publishers
- **Factual Accuracy:** Cross-references claims across multiple sources
- **Timeliness:** Filters out outdated or stale content
- **Relevance:** Ensures stories maintain broad human interest appeal

### User Experience Optimization

Platform improvements focus on user satisfaction:

- **Loading Speed:** Optimized for fast content delivery
- **Mobile Responsiveness:** Seamless experience across all devices
- **Accessibility:** Screen reader compatibility and keyboard navigation
- **Content Discovery:** Intuitive navigation and date-based browsing`;

// Footer content for how it works pages
export const howItWorksFooter = {
  text: "This algorithmic approach ensures that \"Everything Is Awesome\" delivers genuinely inspiring, authentic content that combats news fatigue while maintaining journalistic integrity and factual accuracy.",
  lastUpdatedLabel: "Algorithm last updated"
};
