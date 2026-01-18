# Everything Is Awesome 🌟

A beautiful cross-platform application displaying optimistic, feel-good news stories that restore hope in humanity. This project fetches real news articles, analyzes them with AI for sentiment and positivity, then presents the most uplifting stories with an engaging user interface.

**🚀 Live Demo**: [https://everythingisawesome.news/](https://everythingisawesome.news/)

## 📱 Cross-Platform Architecture

This monorepo contains four main components:

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

### 🔄 Shared Libraries (`/packages`)
- **shared-api** - Platform-agnostic API layer
- **shared-components** - Reusable UI components
- **shared-constants** - Application constants
- **shared-docs** - Documentation utilities
- **shared-hooks** - Custom React hooks
- **shared-types** - Type definitions
- **shared-utils** - Common utility functions
- **shared** - Core shared functionality

**Here's how the application looks across platforms:**

![Everything Is Awesome - Web and Mobile Preview](docs/EverythingIsAwesomeWebAndMobile.jpg)

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
- **Multi-Model AI Support** - Configurable to use either **xAI (Grok)** or **Google (Gemini)** for intelligent content analysis.
- **Advanced Sentiment Analysis** - Uses Grok-3 or Gemini Flash to filter for positivity, hope, and genuine inspiration.
- **AI Opinion Generation** - Generates "AI's Take" analysis for every top story.
- **NewsAPI** - Real-time news data from 100+ diverse sources.
- **AI Image Generation** - Integration with **Grok-2** (xAI) or **Gemini 2.0 Flash / Imagen 3** (Google) for custom story illustrations.
- **Advanced Prompting** - Specialized prompt engineering to distinguish genuine content from promotional material.
- **Generic Duplicate Detection** - Fuzzy string matching algorithms with scientifically optimized thresholds.

### Cloud & DevOps
- **Azure Web App** - Production hosting (Windows App Service Plan)
- **Azure Blob Storage** - Scalable cloud file storage with automatic fallback
- **File System Abstraction** - Unified storage API supporting local and cloud storage
- **GitHub Actions** - CI/CD pipeline automation
- **IISNode** - Node.js integration for Windows App Service
- **Azure CLI** - Infrastructure management and deployment

### Data & Storage
- **Flexible Storage Architecture** - Supports both local file system and Azure Blob Storage
- **Automatic Storage Detection** - Intelligently selects storage backend based on configuration
- **File System Abstraction** - Unified API for seamless storage migration
- **JSON File System** - Lightweight data persistence
- **Static File Serving** - Express.js static middleware with cloud storage support
- **Image Storage** - Organized file system structure with Azure integration
- **Data Persistence** - Deployment-safe data retention across storage backends

### Development Tools
- **concurrently** - Run multiple npm scripts simultaneously
- **nodemon** - Development server auto-restart
- **Git** - Version control with GitHub integration
- **VS Code** - Recommended development environment

## ✨ Features

### 🌐 Web Application
- **Real News Sources**: Fetches authentic articles from 100+ news providers via NewsAPI
- **Advanced AI Curation**: Uses advanced AI (Grok/Gemini) with specialized prompts to distinguish genuine inspiring content from commercial promotions, includes AI-generated opinionated commentary
- **AI-Generated Images**: Custom images generated using AI based on story themes with fallback category images
- **Proprietary Awesome Index**: Advanced 6-step algorithm (50-100 scale) with anti-commercial filtering and duplicate detection
- **Generic Duplicate Detection**: Advanced fuzzy string matching using 12 similarity algorithms with 100% accuracy on test data
- **Content Quality Assurance**: Multi-stage filtering eliminates promotional content, maintains 40+ positivity threshold
- **Modern UI**: Glassmorphism design with smooth animations and responsive layout
- **Smart Navigation**: Browse between different days with intuitive controls
- **Automated Collection**: Daily processing with robust error handling and source diversity
- **Azure Cloud Deployment**: Production-ready deployment on Azure Web App with CI/CD
- **Flexible Storage Architecture**: Seamlessly supports local file system and Azure Blob Storage
- **Intelligent Storage Detection**: Automatically configures optimal storage backend based on environment
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
# - NEWS_API_KEY=your_news_api_key
# - AI_PROVIDER=gemini (or grok)
#  
# For Gemini (Default/Recommended):
# - GEMINI_API_KEY=your_gemini_api_key
# - GEMINI_MODEL=gemini-2.5-flash
# - GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
# - GEMINI_OPINION_MAX_TOKENS=2000
#
# For Grok:
# - GROK_API_KEY=your_grok_api_key
# - GROK_MODEL=grok-3-latest 
# - GROK_IMAGE_MODEL=grok-2-image
# - GROK_SENTIMENT_MAX_TOKENS=10 (use 200 for grok-4)
# - GROK_SUMMARY_MAX_TOKENS=100 (optional - has default, use 250 for grok-4)
# - GROK_IMAGE_PROMPT_MAX_TOKENS=150 (optional - has default, use 300 for grok-4)
# - GROK_OPINION_MAX_TOKENS=300 (optional - has default for opinion generation)
#
# For Azure Blob Storage (optional - local file system used by default):
# - AZURE_STORAGE_ENABLED=true (set to enable Azure Blob Storage)
# - AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
# - AZURE_STORAGE_ACCOUNT_KEY=your_storage_account_key
# - AZURE_STORAGE_CONTAINER_NAME=your_container_name
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

**📖 For comprehensive development setup, testing, deployment, and troubleshooting, see: [DEVELOPMENT_AND_DEPLOYMENT.md](./docs/DEVELOPMENT_AND_DEPLOYMENT.md)**

## 🔄 CI/CD Pipeline

The project uses **dual GitHub Actions workflows** for automated deployments:

### 🌐 Web Application Pipeline (`build_and_deploy.yml`)
- **Triggers**: Push to `main` branch or manual dispatch
- **Purpose**: Builds and deploys web app to Azure Web Apps
- **Features**: Multi-stage approval, Azure integration, production secrets
- **Output**: Live web application at https://everythingisawesome.azurewebsites.net

### 📱 Mobile Application Pipeline (`mobile-release.yml`) 
- **Triggers**: Manual workflow dispatch with configuration options
- **Purpose**: Builds Android APK/AAB and iOS IPA artifacts  
- **Features**: Multi-platform support, keystore management, artifact retention
- **Output**: Ready-to-distribute APK/IPA files and App Store packages

### 🔧 Additional Workflows
- **Dependencies**: Automated security audits and dependency updates
- **Performance**: Performance monitoring and optimization checks

This separation ensures:
- ✅ **Independent Release Cycles** - Web and mobile can be deployed separately
- ✅ **Specialized Configuration** - Each platform has optimized build settings  
- ✅ **Security Isolation** - Different secrets and signing requirements
- ✅ **Workflow Clarity** - Clean, focused pipelines for each platform

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
│   ├── utils/             # Server utilities
│   └── filesystem/        # File system abstraction layer
│       ├── FileSystemFactory.js      # Storage system selector
│       ├── LocalFileSystem.js        # Local file operations
│       └── AzureBlobFileSystem.js    # Azure Blob Storage operations
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

### Android Development

For detailed Android APK building, sideloading, and Play Store release instructions, see: **[Android Development Guide](./docs/ANDROID_DEVELOPMENT.md)**

**Quick Reference**:
```bash
# Build standalone APK (no Metro required)
cd mobile && ./android/gradlew -p android assembleRelease

# Build Play Store AAB
cd mobile && ./android/gradlew -p android bundleRelease

# Install APK via ADB
adb install -r mobile/android/app/build/outputs/apk/release/app-release.apk
```

## 📱 iOS Development

For detailed iOS development, building, code signing, and App Store submission instructions, see: **[iOS Development Guide](./docs/iOS_DEVELOPMENT.md)**

For comprehensive App Store submission process including code signing setup and IPA export, see: **[iOS App Store Submission Guide](./docs/iOS_APP_STORE_SUBMISSION.md)**

**Quick Reference**:
```bash
# Development build (with Metro bundler)
cd mobile && npx expo run:ios --device

# Standalone Release build (no Metro required)
cd mobile && xcodebuild -workspace ios/EverythingIsAwesome.xcworkspace \
  -scheme EverythingIsAwesome -configuration Release \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro Max' \
  -derivedDataPath ios/build clean build

# Build App Store archive
cd mobile && xcodebuild -workspace ios/EverythingIsAwesome.xcworkspace \
  -scheme EverythingIsAwesome -configuration Release \
  -destination generic/platform=iOS \
  -archivePath ios/build/EverythingIsAwesome.xcarchive archive
```

### Automated Mobile Builds (CI/CD)

The project includes a GitHub Actions workflow for automated mobile builds:

#### Using the Mobile Release Workflow

1. **Navigate to Actions tab** in your GitHub repository
2. **Select "Mobile Release"** workflow  
3. **Click "Run workflow"** and configure options:
   - **Platform**: `android`, `ios`, or `both`
   - **Release Type**: `debug`, `release`, or `both`
   - **Build AAB**: Enable for Play Store submission (Android only)
   - **Upload Artifacts**: Create GitHub release with files

#### Workflow Features

- ✅ **Multi-Platform Support**: Android (ready) and iOS (coming soon)
- ✅ **Automated Environment Setup**: Java JDK 17, Android SDK, React Native CLI
- ✅ **Multiple Build Types**: Debug APK, Release APK, Release AAB
- ✅ **Platform Selection**: Choose Android, iOS, or both
- ✅ **Keystore Management**: Uses GitHub secrets or demo keystore
- ✅ **Artifact Upload**: Downloads available for 30-365 days  
- ✅ **GitHub Releases**: Optional automatic release creation
- ✅ **Build Verification**: Size reporting and integrity checks

#### Required GitHub Secrets

For production builds, add these secrets to your repository:

```bash
# Repository Settings → Secrets and variables → Actions → New repository secret
ANDROID_KEYSTORE_PASSWORD    # Your keystore password
ANDROID_KEY_PASSWORD         # Your key password (usually same as keystore)
```

#### Workflow Outputs

| Artifact | Retention | Purpose | Size |
|----------|-----------|---------|------|
| `debug-apk` | 30 days | Development/Testing | ~165MB |
| `release-apk` | 90 days | Sideloading/Distribution | ~70MB |
| `play-store-aab` | 365 days | Google Play Store Submission | ~46MB |

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
├── client/                 # React Web Application (port 3000)
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.js   # Site header with navigation
│   │   │   ├── HomePage.js # Main news page (handles both latest and date-specific news)
│   │   │   └── NewsDisplay.js # News story cards
│   │   ├── services/       # API service layer
│   │   │   └── api.js      # Centralized API calls
│   │   └── App.css         # Beautiful glassmorphism styling
│   ├── build/              # Production build (auto-generated)
│   └── package.json
├── mobile/                 # React Native Mobile App
│   ├── src/
│   │   ├── screens/        # Mobile screens
│   │   ├── components/     # Mobile components
│   │   ├── services/       # Mobile API services
│   │   └── constants/      # Mobile constants
│   ├── App.js              # Main mobile app entry
│   ├── app.json            # Expo configuration
│   ├── android/            # Android platform files
│   ├── ios/                # iOS platform files
│   └── package.json
├── server/                 # Node.js Backend API (port 3001)
│   ├── routes/
│   │   └── news.js         # News API endpoints
│   ├── jobs/
│   │   ├── fetchNews.js    # AI-powered news fetcher
│   │   ├── createSampleData.js # Sample data generator
│   │   └── generateThemedFallbacks.js # Fallback image generator
│   ├── utils/
│   │   └── newsUtils.js    # File and data operations
│   └── index.js            # Express server with static file serving
├── packages/               # Shared Libraries (Monorepo)
│   ├── shared-api/         # Common API layer
│   ├── shared-components/  # Reusable UI components
│   ├── shared-constants/   # Shared constants
│   ├── shared-docs/        # Documentation utilities
│   ├── shared-hooks/       # Custom React hooks
│   ├── shared-types/       # TypeScript/JSDoc types
│   ├── shared-utils/       # Common utilities
│   └── shared/             # Core shared functionality
├── data/                   # Persistent Data Storage
│   ├── generated-images/   # AI-generated story images
│   │   ├── story-*.png     # Individual story images
│   │   └── fallback-*.png  # Themed fallback images
│   └── YYYY-MM-DD.json     # Daily news data files
├── docs/                   # Documentation
│   ├── DEVELOPMENT_AND_DEPLOYMENT.md # Comprehensive development & deployment guide
│   └── *.jpg               # Screenshots and images
├── android/                # Android build configuration
├── .github/workflows/      # GitHub Actions CI/CD
│   ├── build_and_deploy.yml # Web app deployment pipeline  
│   ├── mobile-release.yml  # Mobile APK/AAB build pipeline
│   ├── dependencies.yml   # Dependency updates & security
│   └── performance.yml     # Performance monitoring
├── app.js                  # Azure Web App entry point
├── web.config              # IIS/Azure configuration
├── deploy.cmd              # Azure deployment script
├── package.json            # Root dependencies and scripts
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

## 🤖 How the Algorithm Works

The application uses a sophisticated **6-step curation process** to surface genuinely inspiring stories while filtering out commercial content and negativity bias:

### Step 1: News Article Fetching
- Uses **NewsAPI** to query up to 100 articles daily from 100+ diverse global sources
- Searches with 50+ carefully selected positive keywords: "breakthrough," "cure," "rescue," "discovery," "innovation," "helping," "volunteer," "charity," "triumph," "milestone," "achievement"
- Source filtering currently disabled for maximum content diversity
- Processing limited to 50 articles for API cost management vs. coverage balance

### Step 2: Multi-Stage Pre-Filtering
- **Keyword Filter**: Eliminates articles with zero positive keywords
- **Quality Check**: Filters out placeholder "[Removed]" content from NewsAPI
- **Sentiment Threshold**: Removes articles scoring below 40/100 in positivity
- **Commercial Content Detection**: AI-powered identification of sales/promotional content

### Step 3: Enhanced AI Analysis with Grok-3-Latest
- **Anti-Commercial Filtering**: Product sales/promotional content automatically scored 0-20
- **Main Event Focus**: Algorithm evaluates the primary news event, not just positive entities mentioned
- **Negative Event Detection**: Stories about crimes, scams, or disasters score low even if good organizations are mentioned
- **Charity Exception**: Legitimate fundraising and charity auctions maintain high scores
- **Genuine Content Prioritization**: Scientific breakthroughs, community achievements, and inspiring human stories score 80-100
- **Contextual Understanding**: Distinguishes genuine achievements from marketing content
- **Smart Summarization**: Generates concise, uplifting summaries highlighting inspiring aspects
- **Robust Error Handling**: 3-retry system with fallback scores (50) for reliability

### Step 4: Proprietary Awesome Index Calculation
**Formula**: `Awesome Index = max(50, min(100, sentiment_score + keyword_boost))`

- **Base Sentiment Score**: AI-generated positivity rating (50-100 range)
- **Keyword Density Bonus**: Up to 10 additional points for articles mentioning multiple positive themes
- **Commercial Penalty**: Significant score reduction for sales/promotional content
- **Final Range**: All scores normalized to 50-100 scale, ensuring minimum positivity threshold

### Step 5: Generic Duplicate Detection
Advanced duplicate story detection using cutting-edge fuzzy string matching:
- **12 Similarity Algorithms**: Analyzes titles, summaries, and combined text using ratio, partial ratio, token sort, and token set matching
- **No Hardcoded Keywords**: Purely generic approach that works for any news content (health, sports, politics, entertainment, etc.)
- **Optimal Threshold**: Uses scientifically determined threshold of 70 for maximum accuracy
- **Smart Selection**: Keeps the highest awesome_index story from each duplicate group
- **Proven Performance**: Achieved 100% precision and 100% recall on test data with zero false positives
- **Universal Coverage**: Works across all news categories without requiring manual keyword maintenance

### Step 6: Content Enhancement & Final Selection
- Sorts by awesome_index in descending order
- Removes duplicate stories using generic fuzzy matching algorithm
- Selects top 10 most inspiring unique stories (or all if fewer than 10 qualify)
- **Custom Image Generation**: AI-created visuals using Grok-2-image based on story themes
- **Grok's Opinion Analysis**: AI-generated opinionated commentary providing critical perspective on each story
- **Themed Fallbacks**: Pre-generated category images when AI generation fails
- Preserves authentic source URLs for credibility

### Performance Metrics & Results
Recent algorithm performance (June 2025 data):
- **Articles Processed**: 50-100 per day from NewsAPI
- **Commercial Filtering Success**: ~95% of sales/promotional articles automatically filtered out
- **Content Quality**: Awesome indices ranging from 52-91 with improved distribution
- **Content Diversity**: Community service, scientific discoveries, education, technology breakthroughs, environmental progress
- **Source Variety**: 20+ different news outlets and platforms with quality-focused filtering

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

## 💾 Storage Configuration

### Flexible Storage Options

The application supports two storage backends that are automatically detected:

**Local File System (Default):**
- Stores files in the `/data` directory
- No additional setup required
- Ideal for development and testing

**Azure Blob Storage (Production):**
- Stores files in Azure Blob Storage containers
- Automatic detection based on environment variables
- Ideal for production and scalable deployments

### Enabling Azure Blob Storage

**For Local Development:**
Add these variables to your `.env` file:
```env
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_storage_account_key
AZURE_STORAGE_CONTAINER_NAME=your_container_name
```

**For Production (GitHub Actions):**
Add these as GitHub repository secrets:
- `AZURE_STORAGE_ACCOUNT_NAME`
- `AZURE_STORAGE_ACCOUNT_KEY`
- `AZURE_STORAGE_CONTAINER_NAME`

The deployment pipeline automatically detects these secrets and enables Azure Blob Storage.

### Testing Storage Configuration

The file system abstraction automatically detects the appropriate storage backend based on your environment configuration.

### Storage Migration

The file system abstraction allows seamless migration between storage backends:
- **Zero Code Changes**: Same application logic for both storage types
- **Automatic Detection**: System selects appropriate storage based on configuration
- **Graceful Fallback**: Uses local storage if Azure isn't configured
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

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0) - see the [LICENSE](LICENSE) file for details.

- You are free to use, share, and adapt this work for non-commercial purposes.
- You must give appropriate credit and provide a link to the license.
- You may not use the material for commercial purposes.

For more information, visit: https://creativecommons.org/licenses/by-nc/4.0/
# Trigger build with iOS 18.4 runtime
# Testing iOS 18.4 with fixed YAML
