import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

const getAvailableDates = async () => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''))
      .sort()
      .reverse(); // Most recent first
    
    return jsonFiles;
  } catch (error) {
    console.error('Error reading data directory:', error);
    return [];
  }
};

const getNewsByDate = async (date) => {
  try {
    const filePath = path.join(DATA_DIR, `${date}.json`);
    const exists = await fs.pathExists(filePath);
    
    if (!exists) {
      return null;
    }
    
    const data = await fs.readJson(filePath);
    return data;
  } catch (error) {
    console.error(`Error reading news for date ${date}:`, error);
    return null;
  }
};

const getLatestNews = async () => {
  try {
    const dates = await getAvailableDates();
    if (dates.length === 0) {
      return null;
    }
    
    const latestDate = dates[0];
    return await getNewsByDate(latestDate);
  } catch (error) {
    console.error('Error getting latest news:', error);
    return null;
  }
};

const saveNewsByDate = async (date, newsData) => {
  try {
    const filePath = path.join(DATA_DIR, `${date}.json`);
    await fs.writeJson(filePath, newsData, { spaces: 2 });
    console.log(`News saved for date: ${date}`);
    return true;
  } catch (error) {
    console.error(`Error saving news for date ${date}:`, error);
    return false;
  }
};

const formatDateForFilename = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

const getPreviousDate = (date) => {
  return moment(date).subtract(1, 'day').format('YYYY-MM-DD');
};

export {
  getAvailableDates,
  getNewsByDate,
  getLatestNews,
  saveNewsByDate,
  formatDateForFilename,
  getPreviousDate
};
