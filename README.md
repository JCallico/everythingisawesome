# Everything Is Awesome 🌟

A beautiful website displaying optimistic, feel-good news stories that restore hope in humanity. This project fetches real news articles, analyzes them with AI for sentiment and positivity, then presents the most uplifting stories with an engaging user interface.

![Website Preview](https://via.placeholder.com/800x400/667eea/white?text=Everything+Is+Awesome+News)

## ✨ Features

- **Real News Sources**: Fetches authentic articles from 100+ news providers via NewsAPI
- **AI-Powered Analysis**: Uses Grok-3-latest for sentiment analysis and intelligent summarization  
- **Smart Ranking System**: Advanced awesome_index algorithm (50-100 scale) combining sentiment scores and positive keywords
- **Diverse Content Coverage**: Technology, science, culture, health, environment, and finance stories
- **Beautiful Modern UI**: Glassmorphism design with smooth animations and responsive layout
- **Smart Navigation**: Browse between different days with intuitive controls
- **Automated Collection**: Configurable news fetching with robust error handling
- **Source Flexibility**: Optional filtering by reputable sources (currently disabled for maximum diversity)
- **Image Enhancement**: Relevant high-quality images from Unsplash for each story

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** or yarn
- **Grok API key** from [X.AI Console](https://console.x.ai/) (required)
- **NewsAPI key** from [NewsAPI.org](https://newsapi.org/register) (required)  
- **Unsplash API key** from [Unsplash Developers](https://unsplash.com/developers) (optional, for images)

### Installation

1. **Navigate to the project directory**
   ```bash
   cd /Users/jcallico/Source/Code/everythingisawesome
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```

3. **Configure environment**
   
   Copy the example environment file and add your API keys:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```env
   GROK_API_KEY=your_grok_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   PORT=3001
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Visit [http://localhost:3000](http://localhost:3000) to see your awesome news site! 🎉

## 🎮 Usage

### Manual Commands

- **Start development servers**: `npm run dev` (runs both client and server)
- **Fetch real news**: `npm run fetch-news [YYYY-MM-DD]` (optional date parameter)
- **Create sample data**: `npm run create-sample` (for testing without API keys)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Install all dependencies**: `npm run install-all`

### Fetching News

**Fetch news for a specific date:**
```bash
npm run fetch-news 2025-06-01
```

**Fetch news for yesterday (default):**
```bash
npm run fetch-news
```

**Current Data Coverage:**
The project currently has news data for June 1-13, 2025 (13 days of content).

## 📁 Project Structure

```
everythingisawesome/
├── client/                 # React frontend (port 3000)
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.js   # Site header
│   │   │   ├── HomePage.js # Latest news page
│   │   │   ├── NewsPage.js # Specific date page
│   │   │   └── NewsDisplay.js # News cards
│   │   ├── services/       # API service layer
│   │   └── App.css         # Beautiful styling
│   └── package.json
├── server/                 # Node.js backend (port 3001)
│   ├── routes/
│   │   └── news.js         # API endpoints
│   ├── jobs/
│   │   ├── fetchNews.js    # Daily news fetcher
│   │   └── createSampleData.js # Sample data generator
│   ├── utils/
│   │   └── newsUtils.js    # File operations
│   └── index.js            # Express server
├── data/                   # News database
│   └── YYYY-MM-DD.json     # Daily news files
├── package.json            # Main dependencies
├── .env.example            # Environment template
└── README.md
```

## 🔌 API Endpoints

- `GET /api/news/latest` - Get the most recent news
- `GET /api/news/date/:date` - Get news for a specific date (YYYY-MM-DD)
- `GET /api/news/dates` - Get all available dates (sorted newest first)

Example API response:
```json
{
  "date": "2025-06-05",
  "title": "Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories",
  "stories": [
    {
      "title": "Breakthrough in HIV Cure Research",
      "summary": "A Melbourne research team discovered a method...",
      "link": "https://example.com/article",
      "awesome_index": 95
    }
  ]
}
```

## ⏰ News Fetching Process

### Algorithm Overview
The application uses a sophisticated 5-step process to curate the most uplifting news:

1. **NewsAPI Integration**: Fetches up to 100 articles using 50+ positive keywords
2. **Multi-Stage Filtering**: Eliminates articles with insufficient positive content
3. **Grok AI Analysis**: Sentiment scoring (0-100) and summary generation
4. **Awesome Index Ranking**: Combines sentiment + keyword density (final scores 50-100)
5. **Top 10 Selection**: Chooses and enhances the most inspiring stories

### Configuration Options
```javascript
// In fetchNews.js
const USE_SOURCE_FILTER = false; // Currently disabled for maximum diversity
const POSITIVE_KEYWORDS = [
  'breakthrough', 'cure', 'save', 'rescue', 'hero', 'amazing', 'inspiring',
  'hope', 'success', 'achievement', 'discovery', 'innovation', 'helping'
  // ... 50+ keywords total
];
```

### Automation Setup
You can set up automated daily fetching by modifying `server/index.js`:

```javascript
// Example: Run daily at 6:00 AM
cron.schedule('0 6 * * *', () => {
  fetchDailyNews();
});
```

**Note**: Automated scheduling is currently disabled to avoid unnecessary API costs during development.

## 🎨 Design Features

- **Glassmorphism UI**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Beautiful purple-to-blue gradients
- **Responsive Design**: Works perfectly on mobile and desktop
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: Proper contrast and focus states
- **Modern Typography**: Clean, readable fonts

## 🚀 Deployment

### Development
```bash
npm run dev  # Starts both React frontend (3000) and Express backend (3001)
```

### Production Build
```bash
npm run build  # Builds optimized React app
npm start      # Serves built app via Express server
```

### Environment Variables
Ensure your production environment has:
```env
GROK_API_KEY=your_actual_grok_api_key
NEWS_API_KEY=your_actual_news_api_key  
UNSPLASH_ACCESS_KEY=your_unsplash_key
NODE_ENV=production
PORT=3001
```

### Domain Considerations
- The application works with any domain
- Configure your DNS and hosting to point to your server
- Both frontend and backend are served from the same Express server
- No CORS issues since everything runs on one port in production

## 🔧 Customization

### News Source Configuration

**Enable/Disable Source Filtering:**
```javascript
// In server/jobs/fetchNews.js
const USE_SOURCE_FILTER = false; // Set to true to limit to specific sources
```

**Modify Positive Keywords:**
```javascript
const POSITIVE_KEYWORDS = [
  'breakthrough', 'cure', 'save', 'rescue', 'hero', 'amazing', 'incredible',
  'inspiring', 'hope', 'success', 'achievement', 'discovery', 'innovation'
  // Add your own keywords here
];
```

**Adjust Processing Limits:**
```javascript
// Process up to 50 articles (adjust for API cost vs coverage balance)
for (let i = 0; i < Math.min(articles.length, 50); i++) {
```

### Styling and UI

All styles are in `client/src/App.css`. The design uses:
- CSS custom properties for easy theming
- Flexbox and Grid for responsive layouts  
- Modern CSS features like `backdrop-filter` for glassmorphism
- Smooth transitions and hover effects

### Algorithm Tuning

**Sentiment Threshold:**
```javascript
// Skip articles with very low sentiment scores
if (sentimentScore < 40) { // Adjust threshold (0-100)
  continue;
}
```

**Awesome Index Formula:**
```javascript
// Customize the ranking calculation
const awesomeIndex = Math.max(50, Math.min(100, 
  baseSentimentScore + Math.min(10, positiveKeywordCount * 2)
));
```

### Adding Features

The modular structure makes it easy to add:
- News categories
- Search functionality  
- Social sharing
- Email subscriptions
- Comments system

## 🤖 How the Algorithm Works

The application uses a sophisticated multi-step process to find and rank the most uplifting news stories:

### Step 1: News Article Fetching
- Uses **NewsAPI** to query articles from 100+ diverse sources (NewsAPI source filter disabled)
- Filters by date range and 50+ positive keywords (breakthrough, cure, hope, success, etc.)
- Processes up to 100 articles per day, limited to 50 for API cost management
- Sources include: BBC, CNN, The Verge, Gizmodo, IGN, Hackaday, and many more

### Step 2: Multi-Stage Filtering
- **Keyword Filter**: Eliminates articles with zero positive keywords
- **Sentiment Threshold**: Removes articles scoring below 40/100 in positivity
- **Quality Check**: Filters out removed/placeholder content from NewsAPI

### Step 3: AI-Powered Analysis
- **Sentiment Analysis**: Grok-3-latest analyzes each article's positivity (0-100 scale)
- **Smart Summarization**: Generates concise, uplifting summaries highlighting inspiring aspects
- **Robust Error Handling**: 3-retry system with fallback scores (50) for reliability

### Step 4: Intelligent Ranking
- **Awesome Index Formula**: `sentiment_score + min(keyword_count × 2, 10)`
- Base score from sentiment analysis (50-100 range, ensuring minimum positivity)
- Keyword boost for articles mentioning multiple positive themes (max 10 bonus points)
- Final scores capped at 100 for consistency

### Step 5: Content Enhancement & Selection
- Sorts by awesome_index in descending order
- Selects top 10 most inspiring stories (or all if fewer than 10 qualify)
- Fetches relevant images from Unsplash based on story content
- Preserves authentic source URLs for credibility

### API Integration Benefits
- **NewsAPI**: Provides authentic, timestamped articles from diverse global sources
- **Grok-3-latest**: Latest model for accurate sentiment analysis and creative summarization
- **Unsplash**: Enhances visual appeal with relevant, high-quality imagery
- **Combined Power**: Real news authenticity + AI intelligence = optimized positivity

### Performance Metrics
Recent performance (June 2025 data):
- **Articles Processed**: 50-100 per day from NewsAPI
- **Success Rate**: ~91% of articles filtered out for quality/positivity
- **Top Scores**: Awesome indices ranging from 72-97
- **Content Diversity**: Technology, science, health, entertainment, finance
- **Source Variety**: 20+ different news outlets and platforms

## 📝 News Data Format

Each daily news file follows this structure:

```json
{
  "date": "YYYY-MM-DD",
  "title": "Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories",
  "stories": [
    {
      "title": "Story title",
      "summary": "Brief positive summary highlighting inspiring aspects",
      "link": "https://actual-news-source-url.com",
      "awesome_index": 95
    }
  ]
}
```

**Awesome Index Scale:**
- **95-100**: Life-changing breakthroughs (space discoveries, medical cures)
- **90-94**: Major positive developments (technology innovations, cultural celebrations)  
- **80-89**: Inspiring human achievements (community initiatives, environmental progress)
- **70-79**: Educational and social progress (accessibility, inclusion, sustainability)
- **60-69**: Cultural and entertainment milestones (gaming, arts, media)
- **50-59**: Feel-good stories and acts of kindness (everyday heroes, local news)

### Recent Examples (June 2025)
- **97**: "Incredible auroras delight stargazers in New Zealand" 
- **95**: "Endocrine Images Art Competition Celebrates Science and Art"
- **91**: "Scott Pilgrim Game Spiritual Successor After 15 Years"
- **89**: "Young Americans Embracing Thrifting for Sustainability"
- **87**: "iPad Helped Save Concert Pianist's Career"

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly with real API keys
5. Update README if needed
6. Submit a pull request

### Development Guidelines
- Test both with and without API keys (graceful fallbacks)
- Ensure new features work with the existing UI
- Maintain the positive, uplifting theme
- Follow the existing code style and structure

## � Current Status

**Data Coverage**: June 1-13, 2025 (13 days)  
**Algorithm Version**: Multi-step AI analysis with Grok-3-latest  
**Source Diversity**: 100+ news sources (filter disabled)  
**Processing Capacity**: Up to 100 articles per day  
**Success Rate**: ~10% articles pass all quality filters  
**Average Awesome Index**: 85-90 for top stories  

## �📄 License

MIT License - feel free to use this for spreading positivity!

## 🌟 About

Created to combat negative news cycles and remind people that **everything really is awesome** when you focus on the positive developments happening around the world every day.

This project demonstrates the power of combining real journalism with AI analysis to surface the stories that inspire hope, celebrate human achievement, and showcase the progress being made across technology, science, culture, and society.

**Because the world needs more optimism!** 🌈✨
