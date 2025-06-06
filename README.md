# Everything Is Awesome 🌟

A beautiful website displaying optimistic, feel-good news stories that restore hope in humanity. Perfect for the domain `everythingisawesome.new`!

![Website Preview](https://via.placeholder.com/800x400/667eea/white?text=Everything+Is+Awesome+News)

## ✨ Features

- **Daily Optimistic News**: Displays the most inspiring and uplifting news stories
- **Beautiful Modern UI**: Glassmorphism design with smooth animations and responsive layout
- **Smart Navigation**: Browse between different days with intuitive controls
- **Automated Collection**: Daily scheduled job to fetch news using Grok AI
- **File-based Database**: News stored in JSON files with sortable date format
- **Awesome Index**: Each story rated by how inspiring it is (50-100 scale)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** or yarn
- **Grok API key** from [X.AI Console](https://console.x.ai/) (optional for manual testing)

### Installation

1. **Navigate to the project directory**
   ```bash
   cd /Users/jcallico/Source/Code/everythingisawesome
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```

3. **Configure environment (optional)**
   
   Copy the example environment file and add your Grok API key:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API key:
   ```env
   GROK_API_KEY=your_grok_api_key_here
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

- **Start development servers**: `npm run dev`
- **Create sample data**: `npm run create-sample`
- **Fetch real news**: `npm run fetch-news` (requires API key)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`

### Testing the Application

The application comes with sample data, but you can generate more:

```bash
npm run create-sample
```

This creates news for multiple dates so you can test the navigation features.

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

## ⏰ Automated News Fetching

The application automatically fetches news daily at **6:00 AM** using a cron job. The job:

1. Connects to the Grok API
2. Requests optimistic news from the previous day
3. Saves the results as a JSON file
4. Overwrites existing files if they exist

You can modify the schedule in `server/index.js`:

```javascript
// Runs daily at 6:00 AM
cron.schedule('0 6 * * *', () => {
  fetchDailyNews();
});
```

## 🎨 Design Features

- **Glassmorphism UI**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Beautiful purple-to-blue gradients
- **Responsive Design**: Works perfectly on mobile and desktop
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: Proper contrast and focus states
- **Modern Typography**: Clean, readable fonts

## 🌐 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

The built React app is served by the Express server, making deployment simple.

### Domain Setup

This application is designed for the domain `everythingisawesome.new`. Configure your DNS and hosting to point to your server.

## 🔧 Customization

### Changing the News Source

Edit `server/jobs/fetchNews.js` to modify:
- AI prompt for different news criteria
- API endpoint (currently uses Grok)
- Processing logic

### Styling

All styles are in `client/src/App.css`. The design uses:
- CSS custom properties for easy theming
- Flexbox and Grid for layouts
- Modern CSS features like `backdrop-filter`

### Adding Features

The modular structure makes it easy to add:
- News categories
- Search functionality  
- Social sharing
- Email subscriptions
- Comments system

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
- 95-100: Life-changing breakthroughs
- 90-94: Major positive developments
- 80-89: Inspiring human achievements
- 70-79: Community and environmental wins
- 60-69: Cultural and educational progress
- 50-59: Feel-good stories and acts of kindness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for spreading positivity!

## 🌟 About

Created to combat negative news cycles and remind people that **everything really is awesome** when you focus on the positive developments happening around the world every day.

**Because the world needs more optimism!** 🌈✨
