const express = require('express');
const router = express.Router();
const { getAvailableDates, getNewsByDate, getLatestNews } = require('../utils/newsUtils');

// Get all available dates
router.get('/dates', async (req, res) => {
  try {
    const dates = await getAvailableDates();
    res.json(dates);
  } catch (error) {
    console.error('Error fetching dates:', error);
    res.status(500).json({ error: 'Failed to fetch available dates' });
  }
});

// Get news for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const news = await getNewsByDate(date);
    if (!news) {
      return res.status(404).json({ error: 'News not found for this date' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news by date:', error);
    res.status(500).json({ error: 'Failed to fetch news for the specified date' });
  }
});

// Get latest news
router.get('/latest', async (req, res) => {
  try {
    const news = await getLatestNews();
    if (!news) {
      return res.status(404).json({ error: 'No news available' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    res.status(500).json({ error: 'Failed to fetch latest news' });
  }
});

module.exports = router;
