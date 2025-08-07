import moment from 'moment';
import { createFileSystem } from '../filesystem/FileSystemFactory.js';

// Initialize file system abstraction
const fileSystem = createFileSystem();

const getAvailableDates = async () => {
  try {
    const files = await fileSystem.listFiles();
    const jsonFiles = files
      .filter(file => file.name.endsWith('.json'))
      .map(file => file.name.replace('.json', ''))
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
    const filePath = `${date}.json`;
    const exists = await fileSystem.exists(filePath);
    
    if (!exists) {
      return null;
    }
    
    const content = await fileSystem.read(filePath);
    const data = JSON.parse(content);
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
    const filePath = `${date}.json`;
    await fileSystem.write(filePath, JSON.stringify(newsData, null, 2));
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
