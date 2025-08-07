import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createFileSystem } from './filesystem/FileSystemFactory.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize file system abstraction  
const fileSystem = createFileSystem();

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
    console.log('[0] Static files configured:', staticPath);
  } else {
    console.error('[0] Static files directory not found:', staticPath);
  }

  // File system configuration logging
  const fileSystemType = fileSystem.constructor.name;
  if (fileSystemType === 'AzureBlobFileSystem') {
    console.log('[0] File system configured: Azure Blob Storage');
    console.log('    Storage Account:', process.env.AZURE_STORAGE_ACCOUNT_NAME || 'Not configured');
    console.log('    Container Name:', process.env.AZURE_STORAGE_CONTAINER_NAME || 'Not configured');
    console.log('[0] Images path configured: Azure Blob Storage (generated-images container path)');
  } else {
    console.log('[0] File system configured:', fileSystem.getBasePath());
    console.log('[0] Images path configured:', fileSystem.getImagesPath());
  }

  // Serve generated images from file system abstraction
  app.get('/generated-images/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      const imagePath = `generated-images/${filename}`;
      
      // Check if image exists
      const exists = await fileSystem.exists(imagePath);
      if (!exists) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      // Get the image data
      const imageData = await fileSystem.read(imagePath, null); // null encoding for binary data
      
      // Set appropriate content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      const contentTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      
      const contentType = contentTypes[ext] || 'image/png';
      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      
      res.send(imageData);
    } catch (error) {
      console.error('Error serving image:', error);
      res.status(500).json({ error: 'Failed to serve image' });
    }
  });
  console.log('[0] Generated images route configured (using file system abstraction)');
  
  // Log storage configuration summary
  const storageType = fileSystem.constructor.name === 'AzureBlobFileSystem' ? 'Azure Blob Storage' : 'Local File System';
  console.log(`[0] ✅ Storage backend: ${storageType}`);

  // Health check endpoint
  app.get('/health', async (req, res) => {
    try {
      // Count JSON files and images using file system abstraction
      const files = await fileSystem.listFiles();
      const jsonFileCount = files.filter(file => file.name.endsWith('.json')).length;
      
      const imageFiles = await fileSystem.listFiles('generated-images');
      const imagePattern = /\.(png|jpg|jpeg|gif)$/i;
      const imageFileCount = imageFiles.filter(file => imagePattern.test(file.name)).length;
      
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: {
          node_version: process.version,
          port: PORT,
          env: process.env.NODE_ENV || 'development'
        },
        data: {
          file_system_type: fileSystem.constructor.name,
          base_path: fileSystem.getBasePath(),
          images_path: fileSystem.getImagesPath(),
          json_files: jsonFileCount,
          image_files: imageFileCount
        },
        routes: {
          news_api: true,
          static_files: fs.existsSync(staticPath)
        }
      };
      
      res.json(health);
    } catch (error) {
      console.error('Error in health check:', error);
      res.status(500).json({
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
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
