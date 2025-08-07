import dotenv from 'dotenv';
import { LocalFileSystem } from './LocalFileSystem.js';
import { AzureBlobFileSystem } from './AzureBlobFileSystem.js';

// Load environment variables
dotenv.config();

/**
 * FileSystemFactory
 * Creates the appropriate file system implementation based on environment configuration
 */

let fileSystemInstance = null;

export function createFileSystem() {
  // Return singleton instance if already created
  if (fileSystemInstance) {
    return fileSystemInstance;
  }

  const isAzureEnabled = process.env.AZURE_STORAGE_ENABLED === 'true';

  if (isAzureEnabled) {
    console.log('🔵 Using Azure Blob Storage for file operations');
    
    const config = {
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME
    };

    // Validate configuration
    if (!config.accountName || !config.accountKey || !config.containerName) {
      console.error('❌ Azure Storage configuration is incomplete. Missing required environment variables:');
      console.error('   AZURE_STORAGE_ACCOUNT_NAME:', !!config.accountName);
      console.error('   AZURE_STORAGE_ACCOUNT_KEY:', !!config.accountKey);
      console.error('   AZURE_STORAGE_CONTAINER_NAME:', !!config.containerName);
      console.error('   Falling back to local file system');
      
      fileSystemInstance = new LocalFileSystem();
    } else {
      try {
        fileSystemInstance = new AzureBlobFileSystem(config);
      } catch (error) {
        console.error('❌ Failed to initialize Azure Blob Storage:', error.message);
        console.error('   Falling back to local file system');
        fileSystemInstance = new LocalFileSystem();
      }
    }
  } else {
    console.log('📁 Using local file system for file operations');
    
    const localDataPath = process.env.LOCAL_DATA_PATH || './data';
    fileSystemInstance = new LocalFileSystem(localDataPath);
  }

  return fileSystemInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetFileSystem() {
  fileSystemInstance = null;
}

/**
 * Get current file system type
 */
export function getFileSystemType() {
  const isAzureEnabled = process.env.AZURE_STORAGE_ENABLED === 'true';
  return isAzureEnabled ? 'azure' : 'local';
}

/**
 * Check if Azure Storage is properly configured
 */
export function isAzureStorageConfigured() {
  return !!(
    process.env.AZURE_STORAGE_ACCOUNT_NAME &&
    process.env.AZURE_STORAGE_ACCOUNT_KEY &&
    process.env.AZURE_STORAGE_CONTAINER_NAME
  );
}
