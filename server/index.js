import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load cron, but don't fail if it's missing
let cron;
try {
  const cronModule = await import('node-cron');
  cron = cronModule.default;
} catch (error) {
  console.log('node-cron not available:', error.message);
}

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  console.log('Starting server...');
  console.log('Node version:', process.version);
  console.log('PORT:', PORT);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Serve static files from React build
  const staticPath = path.join(__dirname, '../client/build');
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
    console.log('Static files configured:', staticPath);
  } else {
    console.error('Static files directory not found:', staticPath);
  }

  // Ensure data directory exists
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Created data directory');
  }

  // Ensure generated-images directory exists
  const generatedImagesDir = path.join(__dirname, '../data/generated-images');
  if (!fs.existsSync(generatedImagesDir)) {
    fs.mkdirSync(generatedImagesDir, { recursive: true });
    console.log('Created generated-images directory');
  }

  // Serve generated images from data folder (for images created by fetchNews job)
  const generatedImagesPath = path.join(__dirname, '../data/generated-images');
  app.use('/generated-images', express.static(generatedImagesPath));
  console.log('Generated images route configured:', generatedImagesPath);

  // Health check endpoint
  app.get('/health', (req, res) => {
    const dataExists = fs.existsSync(dataDir);
    const generatedImagesExists = fs.existsSync(generatedImagesDir);
  
    // Count JSON files and images
    let jsonFileCount = 0;
    let imageFileCount = 0;
  
    try {
      if (dataExists) {
        const files = fs.readdirSync(dataDir);
        jsonFileCount = files.filter(file => file.endsWith('.json')).length;
      }
    
      if (generatedImagesExists) {
        const images = fs.readdirSync(generatedImagesDir);
        const imagePattern = /\.(png|jpg|jpeg|gif)$/i;
        imageFileCount = images.filter(file => imagePattern.test(file)).length;
      }
    } catch (error) {
      console.error('Error reading directories for health check:', error);
    }
  
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: {
        node_version: process.version,
        port: PORT,
        env: process.env.NODE_ENV || 'development'
      },
      data: {
        folder_exists: dataExists,
        json_files: jsonFileCount,
        generated_images_folder: generatedImagesExists,
        image_files: imageFileCount
      },
      routes: {
        news_api: true,
        static_files: fs.existsSync(staticPath)
      }
    };
  
    res.json(health);
  });

  // Try to load news routes
  try {
    const newsModule = await import('./routes/news.js');
    const newsRoutes = newsModule.default;
    app.use('/api/news', newsRoutes);
    console.log('News routes loaded successfully');
  } catch (error) {
    console.error('Error loading news routes:', error.message);
    // Provide fallback API (Express 5 compatible)
    app.use('/api/news', (req, res) => {
      res.status(500).json({ 
        error: 'News API temporarily unavailable',
        message: error.message 
      });
    });
  }

  // Serve React app for any non-API routes (Express 5 compatible)
  app.use((req, res) => {
  // Only serve the React app for non-API routes
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/generated-images/')) {
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
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  // Schedule daily news fetch at 6:00 AM every day (if cron is available)
  if (cron) {
    try {
      const fetchNewsModule = await import('./jobs/fetchNews.js');
      const { fetchDailyNews } = fetchNewsModule;
      cron.schedule('0 6 * * *', () => {
        console.log('Running scheduled news fetch...');
        fetchDailyNews();
      }, {
        timezone: 'America/New_York'
      });
      console.log('Daily news fetch scheduled for 6:00 AM');
    } catch (error) {
      console.log('News fetching not available:', error.message);
    }
  } else {
    console.log('Cron scheduling not available');
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log('✅ Application started successfully');
  });

  return app;
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
