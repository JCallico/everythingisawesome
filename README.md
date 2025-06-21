# Everything Is Awesome 🌟

A beautiful cross-platform application displaying optimistic, feel-good news stories that restore hope in humanity. This project fetches real news articles, analyzes them with AI for sentiment and positivity, then presents the most uplifting stories with an engaging user interface.

**🚀 Live Demo**: [https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/](https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/)

## 📱 Cross-Platform Architecture

This monorepo contains three main components:

### 🌐 Web Application (`/client`)
- **React 19** web application
- Responsive design with glassmorphism UI
- Deployed to Azure Web Apps

### 📱 Mobile Application (`/mobile`)
- **React Native** with Expo
- Native iOS and Android support  
- **Swipe Gestures** - Navigate between stories with intuitive swipe controls
- **Haptic Feedback** - Enhanced mobile experience with touch feedback
- **Native Sharing** - Built-in share functionality for stories
- **Auto-rotation** - Stories automatically transition every 30 seconds
- **Touch Navigation** - Tap on story content to view detailed view
- **Responsive Design** - Optimized for mobile screens and interactions
- **Cross-platform** - Single codebase for iOS, Android, and web
- Shared business logic with web

### 🚀 Backend API (`/server`)
- **Node.js & Express** REST API
- AI-powered news analysis
- Shared by both web and mobile clients

### 🔄 Shared Libraries (`/shared`)
- Common utilities and types
- API service layer
- Business logic components

## 💻 Tech Stack

### Frontend
- **React 19** - Modern UI framework with hooks
- **React Router DOM 7** - Client-side routing for SPA navigation
- **Axios** - HTTP client for API communication
- **CSS3** - Glassmorphism design with animations
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js 22** - JavaScript runtime
- **Express.js** - Web application framework
- **fs-extra** - Enhanced file system operations
- **node-cron** - Scheduled task management
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### AI & APIs
- **Grok-3-latest** - X.AI's latest model for sentiment analysis and summarization
- **Grok Image Generation** - AI-powered custom image creation
- **NewsAPI** - Real-time news data from 100+ sources
- **Advanced Prompting** - Sophisticated AI prompt engineering

### Cloud & DevOps
- **Azure Web App** - Production hosting (Windows App Service Plan)
- **GitHub Actions** - CI/CD pipeline automation
- **IISNode** - Node.js integration for Windows App Service
- **Azure CLI** - Infrastructure management and deployment

### Data & Storage
- **JSON File System** - Lightweight data persistence
- **Static File Serving** - Express.js static middleware
- **Image Storage** - Organized file system structure
- **Data Persistence** - Deployment-safe data retention

### Development Tools
- **concurrently** - Run multiple npm scripts simultaneously
- **nodemon** - Development server auto-restart
- **Git** - Version control with GitHub integration
- **VS Code** - Recommended development environment

## 📊 Current Status

**Live Application**: [https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/](https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/)

**Data Coverage**: June 1-17, 2025 (17 days)  
**Image Collection**: 180+ AI-generated story images + 9 themed fallbacks  
**Algorithm Version**: Multi-step AI analysis with Grok-3-latest  
**Source Diversity**: 100+ news sources (filter disabled for maximum variety)  
**Processing Capacity**: Up to 100 articles per day (limited to 50 for cost management)  
**Success Rate**: ~10% articles pass all quality filters  
**Average Awesome Index**: 85-90 for top stories  
**Deployment**: Automated CI/CD with data persistence  e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/)

![Website Preview](https://via.placeholder.com/800x400/667eea/white?text=Everything+Is+Awesome+News)

## ✨ Features

### 🌐 Web Application
- **Real News Sources**: Fetches authentic articles from 100+ news providers via NewsAPI
- **AI-Powered Analysis**: Uses Grok-3-latest for sentiment analysis and intelligent summarization
- **AI-Generated Images**: Custom images generated using Grok's AI image generation for each story
- **Smart Ranking System**: Advanced awesome_index algorithm (50-100 scale) combining sentiment scores and positive keywords
- **Diverse Content Coverage**: Technology, science, culture, health, environment, and finance stories
- **Modern UI**: Glassmorphism design with smooth animations and responsive layout
- **Smart Navigation**: Browse between different days with intuitive controls
- **Automated Collection**: Configurable news fetching with robust error handling
- **Azure Cloud Deployment**: Production-ready deployment on Azure Web App with CI/CD
- **Persistent Data Storage**: Generated images and news data persist between deployments
- **Source Flexibility**: Optional filtering by reputable sources (currently disabled for maximum diversity)

### 📱 Mobile Application
- **Cross-Platform**: Single React Native codebase runs on iOS, Android, and web
- **Swipe Navigation**: Intuitive left/right swipe gestures to navigate between stories
- **Haptic Feedback**: Enhanced mobile experience with tactile responses
- **Native Sharing**: Built-in platform sharing for stories via SMS, email, social media
- **Auto-Rotation**: Stories automatically transition every 30 seconds (pausable)
- **Touch Interactions**: Tap story content or use dedicated "View Details" button
- **Story Details Screen**: Full-screen story view with comprehensive information
- **Theme-Based Gradients**: Dynamic color schemes based on story categories
- **Mobile-Optimized UI**: Designed specifically for touch interfaces
- **Offline-Ready**: Cached data for improved performance
- **Real-time API**: Seamless integration with the same backend as web

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- For mobile development: Expo CLI
- Git for version control

### Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd everythingisawesome

# Install all dependencies (web, mobile, and server)
npm run install-all

# Set up environment variables
# Copy .env.example to .env and add your API keys:
# - GROK_API_KEY=your_grok_api_key
# - NEWS_API_KEY=your_news_api_key
```

### Development Commands

```bash
# Start web + server (recommended for web development)
npm run dev

# Start mobile + server (for mobile development)
npm run dev:mobile

# Start everything (web + mobile + server)
npm run dev:all

# Individual components
npm run server     # Backend API only
npm run client     # Web app only
npm run mobile     # Mobile app only
```

### Building for Production

```bash
# Build web application
npm run build

# Build mobile application
npm run build:mobile
```

## 📁 Project Structure

```
everythingisawesome/
├── client/                 # React Web Application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── App.js
│   └── package.json
│
├── mobile/                 # React Native Mobile App
│   ├── src/
│   │   ├── screens/       # Mobile screens
│   │   ├── components/    # Mobile components
│   │   ├── services/      # Mobile API services
│   │   └── styles/        # Mobile stylesheets
│   ├── App.js
│   └── package.json
│
├── server/                 # Backend API & Jobs
│   ├── index.js           # Express server
│   ├── jobs/              # Scheduled tasks
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   └── utils/             # Server utilities
│
├── shared/                 # Shared Libraries
│   ├── api.js             # Platform-agnostic API layer
│   ├── utils.js           # Common utilities
│   └── types.js           # Type definitions
│
├── data/                   # News data storage
│   ├── *.json             # Daily news files
│   └── generated-images/  # AI-generated images
│
└── package.json           # Root package manager
```

## 🔄 Development Workflow

### For Web Development
```bash
npm run dev              # Starts server + web client
# Open http://localhost:3000
```

### For Mobile Development
```bash
npm run dev:mobile       # Starts server + mobile app
# Use Expo app on your phone or simulator
```

### For Full-Stack Development
```bash
npm run dev:all          # Starts everything
# Web: http://localhost:3000
# Mobile: Use Expo app
# API: http://localhost:3001
```

## 📱 Mobile Development

The mobile app is built with **Expo** and **React Native**, providing:

- **Cross-platform**: Single codebase for iOS and Android
- **Shared Logic**: Reuses business logic from web app
- **Native Feel**: Platform-specific UI components
- **Easy Testing**: Use Expo app for instant preview

### Mobile-Specific Features
- Gesture-based navigation
- Native animations
- Pull-to-refresh
- Haptic feedback
- Push notifications (coming soon)

### Testing Mobile App

1. Install Expo app on your phone
2. Run `npm run dev:mobile`
3. Scan QR code with Expo app
4. App updates automatically as you develop

## 🎮 Usage

### Manual Commands

- **Start development servers**: `npm run dev` (runs both client and server)
- **Fetch real news**: `npm run fetch-news [YYYY-MM-DD]` (optional date parameter)
- **Create sample data**: `npm run create-sample` (for testing without API keys)
- **Generate themed fallback images**: `npm run generate-themed-fallbacks` (creates 9 themed fallback images)
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
The project currently has news data for June 1-17, 2025 (17 days of content) with over 180 AI-generated story images.

## 📁 Project Structure

```
everythingisawesome/
├── client/                 # React frontend (port 3000)
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.js   # Site header with navigation
│   │   │   ├── HomePage.js # Latest news homepage
│   │   │   ├── NewsPage.js # Date-specific news page
│   │   │   └── NewsDisplay.js # News story cards
│   │   ├── services/       # API service layer
│   │   │   └── api.js      # Centralized API calls
│   │   └── App.css         # Beautiful glassmorphism styling
│   ├── build/              # Production build (auto-generated)
│   └── package.json
├── server/                 # Node.js backend (port 3001)
│   ├── routes/
│   │   └── news.js         # News API endpoints
│   ├── jobs/
│   │   ├── fetchNews.js    # AI-powered news fetcher
│   │   ├── createSampleData.js # Sample data generator
│   │   └── generateThemedFallbacks.js # Fallback image generator
│   ├── utils/
│   │   └── newsUtils.js    # File and data operations
│   └── index.js            # Express server with static file serving
├── data/                   # Persistent data storage
│   ├── generated-images/   # AI-generated story images
│   │   ├── story-*.png     # Individual story images
│   │   └── fallback-*.png  # Themed fallback images
│   └── YYYY-MM-DD.json     # Daily news data files
├── app.js                  # Azure Web App entry point
├── web.config              # IIS/Azure configuration
├── .github/workflows/      # GitHub Actions CI/CD
│   └── main_everythingisawesome.yml # Deployment pipeline
├── package.json            # Main dependencies and scripts
├── .env.example            # Environment template
└── README.md
```

## 🔌 API Endpoints

- `GET /api/news/latest` - Get the most recent news
- `GET /api/news/date/:date` - Get news for a specific date (YYYY-MM-DD)
- `GET /api/news/dates` - Get all available dates (sorted newest first)
- `GET /api/health` - Application health check and diagnostics
- `GET /api/debug` - Detailed server information for troubleshooting
- `GET /generated-images/*` - Serve AI-generated story images

Example API response:
```json
{
  "date": "2025-06-17",
  "title": "Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories",
  "stories": [
    {
      "title": "Breakthrough in HIV Cure Research",
      "summary": "A Melbourne research team discovered a method...",
      "link": "https://example.com/article",
      "awesome_index": 95,
      "imageUrl": "/generated-images/story-1-1750240900848.png",
      "source": "bbc-news",
      "theme": "medical"
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

### Azure Cloud Deployment (Production)

**Live Application**: [https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/](https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/)

The application is deployed on **Azure Web App** with automated CI/CD via GitHub Actions:

#### Deployment Features:
- ✅ **Automated deployments** on every push to `main` branch
- ✅ **Data persistence** - news data and generated images survive deployments
- ✅ **Environment variable management** via Azure App Service settings
- ✅ **Node.js 22** runtime on Windows App Service Plan
- ✅ **Static file serving** for React build and generated images
- ✅ **Health monitoring** with diagnostic endpoints

#### Required Azure App Service Settings:
```env
NODE_ENV=production
GROK_API_KEY=your_actual_grok_api_key
NEWS_API_KEY=your_actual_news_api_key
WEBSITE_NODE_DEFAULT_VERSION=~22
```

#### GitHub Secrets Required:
- `GROK_API_KEY` - Your X.AI Grok API key
- `NEWS_API_KEY` - Your NewsAPI.org key
- Azure deployment credentials (auto-configured)

### Local Development
```bash
npm run dev  # Starts both React frontend (3000) and Express backend (3001)
```

### Local Production Build
```bash
npm run build  # Builds optimized React app
npm start      # Serves built app via Express server (port 3001)
```

### Key Architecture Notes:
- **Single-server deployment**: Both frontend and backend served from Node.js Express server
- **No CORS issues**: React build served as static files from the same origin
- **Persistent storage**: `/data` folder preserved between deployments (`clean: false`)
- **Image serving**: Generated images served directly from `/data/generated-images/`

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
- **Sentiment Threshold**: Removes articles scoring below 40/100 in positivity (effectively filtering out commercial content)
- **Commercial Content Filter**: AI-powered detection automatically scores product sales, shopping deals, and promotional content below threshold
- **Quality Check**: Filters out removed/placeholder content from NewsAPI

### Step 3: AI-Powered Analysis
- **Enhanced Sentiment Analysis**: Grok-3-latest analyzes each article's positivity (0-100 scale) with specialized anti-commercial filtering
- **Commercial Content Detection**: Automatically scores product sales, deals, and promotional content very low (0-20) to filter out non-inspiring commercial articles
- **Genuine Content Prioritization**: Prioritizes authentic human interest stories, scientific breakthroughs, community help, and inspiring achievements (80-100 scoring)
- **Charity Exception**: Maintains high scores for charity auctions and fundraising content even when prices are mentioned
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
- Generates relevant AI images using Grok's image generation based on story content
- Preserves authentic source URLs for credibility

### API Integration Benefits
- **NewsAPI**: Provides authentic, timestamped articles from diverse global sources
- **Enhanced Grok-3-latest**: Latest model with specialized prompts for accurate sentiment analysis, creative summarization, and commercial content filtering
- **Grok-2-image**: AI-generated images tailored to each story's content and theme
- **Combined Power**: Real news authenticity + AI intelligence + commercial filtering = optimized genuine positivity

### Performance Metrics
Recent performance (June 2025 data):
- **Articles Processed**: 50-100 per day from NewsAPI
- **Commercial Filtering Success**: ~95% of sales/promotional articles automatically filtered out
- **Content Quality**: Awesome indices ranging from 52-91 (improved distribution with commercial filtering)
- **Content Diversity**: Community service, scientific discoveries, education, technology breakthroughs, environmental progress
- **Source Variety**: 20+ different news outlets and platforms with quality-focused filtering

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

### Themed Fallback Images

The application uses Grok AI to generate unique, contextual images for each news story. When image generation fails, it falls back to themed images that match the story content:

**Available Themes:**
- **Medical/Health**: Medical research and healthcare imagery
- **Technology/Innovation**: Futuristic tech and innovation scenes
- **Education/Learning**: Educational environments and learning
- **Environment/Nature**: Natural landscapes and conservation
- **Community/Social**: People coming together and collaboration
- **Science/Research**: Research facilities and scientific discovery
- **Sports/Athletics**: Athletic achievements and celebrations
- **Arts/Culture**: Creative and artistic scenes
- **General/Default**: Inspiring sunrise and hope imagery

**Generate Themed Fallbacks:**
```bash
npm run generate-themed-fallbacks
```

This command creates 9 themed fallback images (one for each theme) using Grok AI. The system automatically detects the theme of each news story and uses the appropriate fallback image when needed.

## 🎨 AI Image Generation

The application features advanced AI-powered image generation for visual storytelling:

### Image Generation Process:
- **Story-Specific Images**: Each news story gets a unique AI-generated image based on its content
- **Grok AI Integration**: Uses X.AI's Grok image generation API for high-quality visuals
- **Intelligent Prompting**: Analyzes story content to create relevant, inspiring image prompts
- **Fallback System**: 9 themed fallback images (technology, medical, environment, etc.) for reliability
- **Persistent Storage**: Images saved to `/data/generated-images/` and preserved between deployments

### Image Features:
- **Unique Naming**: `story-{index}-{timestamp}.png` format prevents conflicts
- **Optimized Delivery**: Served directly via Express static file serving at `/generated-images/*`
- **Theme-Based Fallbacks**: Pre-generated themed images ensure every story has a visual
- **Production Ready**: Works seamlessly in both development and Azure cloud deployment

### Current Image Collection:
- **180+ Generated Images**: Over 180 unique AI-generated story images
- **9 Themed Fallbacks**: Arts, Community, Education, Environment, General, Medical, Science, Sports, Technology
- **Automatic Cleanup**: `.gitignore` configured to exclude images from repository while preserving structure

### Technical Implementation:
```javascript
// Example image generation call
const imagePrompt = `Create an inspiring, optimistic image related to: ${storyTitle}`;
const response = await grokAPI.generateImage(imagePrompt);
const imagePath = `/generated-images/story-${index}-${timestamp}.png`;
```
