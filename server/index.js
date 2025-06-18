const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Try to load cron, but don't fail if it's missing
let cron;
try {
  cron = require('node-cron');
} catch (error) {
  console.log('node-cron not available:', error.message);
}

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Starting server...');
console.log('Node version:', process.version);
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

// Serve static files from React build
const staticPath = path.join(__dirname, '../client/build');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  console.log('Static files configured:', staticPath);
} else {
  console.error('Static files directory not found:', staticPath);
}

// Serve generated images from data folder (for images created by fetchNews job)
const generatedImagesPath = path.join(__dirname, '../data/generated-images');
app.use('/generated-images', express.static(generatedImagesPath));
console.log('Generated images route configured:', generatedImagesPath);

// Ensure generated-images directory exists
const generatedImagesDir = path.join(__dirname, '../data/generated-images');
if (!fs.existsSync(generatedImagesDir)) {
  fs.mkdirSync(generatedImagesDir, { recursive: true });
  console.log('Created generated-images directory');
}

// Try to load news routes
try {
  const newsRoutes = require('./routes/news');
  app.use('/api/news', newsRoutes);
  console.log('News routes loaded successfully');
} catch (error) {
  console.error('Error loading news routes:', error.message);
  // Provide fallback API
  app.get('/api/news/*', (req, res) => {
    res.status(500).json({ 
      error: 'News API temporarily unavailable',
      message: error.message 
    });
  });
}

// Serve React app for any non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../client/build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <h1>Application Loading...</h1>
      <p>The React application files are not yet available.</p>
      <p>Please wait for the build process to complete.</p>
    `);
  }
});

// Schedule daily news fetch at 6:00 AM every day (if cron is available)
if (cron) {
  try {
    const { fetchDailyNews } = require('./jobs/fetchNews');
    cron.schedule('0 6 * * *', () => {
      console.log('Running scheduled news fetch...');
      fetchDailyNews();
    }, {
      timezone: "America/New_York"
    });
    console.log('Daily news fetch scheduled for 6:00 AM');
  } catch (error) {
    console.log('News fetching not available:', error.message);
  }
} else {
  console.log('Cron scheduling not available');
}

// Diagnostic endpoints for Azure deployment troubleshooting
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      PWD: process.env.PWD || process.cwd(),
      HOME: process.env.HOME,
      WEBSITE_SITE_NAME: process.env.WEBSITE_SITE_NAME,
      WEBSITE_NODE_DEFAULT_VERSION: process.env.WEBSITE_NODE_DEFAULT_VERSION,
      IISNODE_VERSION: process.env.IISNODE_VERSION
    }
  });
});

app.get('/api/debug', (req, res) => {
  res.json({
    headers: req.headers,
    url: req.url,
    method: req.method,
    query: req.query,
    params: req.params,
    serverInfo: {
      cwd: process.cwd(),
      execPath: process.execPath,
      execArgv: process.execArgv,
      argv: process.argv,
      versions: process.versions
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('✅ Application started successfully');
});

module.exports = app;
