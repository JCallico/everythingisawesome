const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
require('dotenv').config();

const newsRoutes = require('./routes/news');
const { fetchDailyNews } = require('./jobs/fetchNews');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/api/news', newsRoutes);

// Serve React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Schedule daily news fetch at 6:00 AM every day
cron.schedule('0 6 * * *', () => {
  console.log('Running scheduled news fetch...');
  fetchDailyNews();
}, {
  timezone: "America/New_York"
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Daily news fetch scheduled for 6:00 AM');
});

module.exports = app;
