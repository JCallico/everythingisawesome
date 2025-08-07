import dotenv from 'dotenv';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Azure Storage configuration
const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;
const STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;

// Local data directory
const LOCAL_DATA_DIR = path.join(__dirname, '../../data');

// Validate environment variables
if (!STORAGE_ACCOUNT_NAME || !CONTAINER_NAME || !STORAGE_ACCOUNT_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   AZURE_STORAGE_ACCOUNT_NAME:', !!STORAGE_ACCOUNT_NAME);
  console.error('   AZURE_STORAGE_CONTAINER_NAME:', !!CONTAINER_NAME);
  console.error('   AZURE_STORAGE_ACCOUNT_KEY:', !!STORAGE_ACCOUNT_KEY);
  console.error('   Please check your .env file');
  process.exit(1);
}

class DataSyncToAzure {
  constructor() {
    // Use storage account key for authentication
    const credential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY);
    this.blobServiceClient = new BlobServiceClient(
      `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      credential
    );
    this.containerClient = this.blobServiceClient.getContainerClient(CONTAINER_NAME);
  }

  async verifyConnection() {
    console.log('🔗 Verifying Azure Storage connection...');
    try {
      await this.containerClient.getProperties();
      console.log('✅ Connected to Azure Storage successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Azure Storage:', error.message);
      return false;
    }
  }

  async getLocalFiles() {
    console.log(`📂 Scanning local data directory: ${LOCAL_DATA_DIR}`);
    try {
      if (!await fs.pathExists(LOCAL_DATA_DIR)) {
        console.error(`❌ Local data directory does not exist: ${LOCAL_DATA_DIR}`);
        return [];
      }

      const validFiles = [];
      await this.scanDirectoryRecursively(LOCAL_DATA_DIR, LOCAL_DATA_DIR, validFiles);

      console.log(`📋 Found ${validFiles.length} files to sync:`);
      validFiles.forEach(file => {
        console.log(`  📄 ${file.blobName} (${file.size} bytes)`);
      });

      return validFiles;
    } catch (error) {
      console.error('❌ Failed to scan local directory:', error.message);
      return [];
    }
  }

  async scanDirectoryRecursively(currentDir, baseDir, fileList) {
    const items = await fs.readdir(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isFile()) {
        // Calculate relative path from base directory for blob name
        const relativePath = path.relative(baseDir, itemPath);
        // Convert Windows path separators to forward slashes for blob storage
        const blobName = relativePath.replace(/\\/g, '/');
        
        fileList.push({
          name: item,
          path: itemPath,
          blobName: blobName,
          size: stats.size,
          modified: stats.mtime,
          directory: path.relative(baseDir, currentDir) || 'root'
        });
      } else if (stats.isDirectory()) {
        console.log(`📁 Scanning subdirectory: ${path.relative(baseDir, itemPath)}`);
        await this.scanDirectoryRecursively(itemPath, baseDir, fileList);
      }
    }
  }

  async getExistingBlobs() {
    console.log('🔍 Checking existing blobs in container...');
    try {
      const existingBlobs = new Map();
      
      for await (const blob of this.containerClient.listBlobsFlat()) {
        existingBlobs.set(blob.name, {
          name: blob.name,
          size: blob.properties.contentLength,
          lastModified: blob.properties.lastModified,
          etag: blob.properties.etag
        });
      }

      console.log(`📦 Found ${existingBlobs.size} existing blobs in container`);
      if (existingBlobs.size > 0) {
        console.log('   Existing files:');
        for (const [name, blob] of existingBlobs) {
          console.log(`   📄 ${name} (${blob.size} bytes)`);
        }
      }

      return existingBlobs;
    } catch (error) {
      console.error('❌ Failed to list existing blobs:', error.message);
      return new Map();
    }
  }

  async uploadFile(file, existingBlobs) {
    try {
      // Check if file already exists and compare
      const existingBlob = existingBlobs.get(file.blobName);
      let action = 'Uploading';

      if (existingBlob) {
        if (existingBlob.size === file.size) {
          // File exists with same size, skip upload
          console.log(`⏭️  Skipping ${file.blobName}... (same size: ${file.size} bytes) [${file.directory}]`);
          return { success: true, action: 'Skipped', file: file.blobName };
        } else {
          action = 'Overwriting';
        }
      } else {
        action = 'Uploading';
      }

      const blobClient = this.containerClient.getBlockBlobClient(file.blobName);
      const content = await fs.readFile(file.path);

      console.log(`📤 ${action} ${file.blobName}... (${file.size} bytes) [${file.directory}]`);

      // Determine content type based on file extension
      const contentType = this.getContentType(file.name);

      const uploadResponse = await blobClient.upload(content, content.length, {
        blobHTTPHeaders: {
          blobContentType: contentType
        },
        tags: {
          'source': 'local-data-sync',
          'uploaded': new Date().toISOString(),
          'original-size': file.size.toString(),
          'directory': file.directory
        }
      });

      console.log(`✅ ${action.slice(0, -3)}ed ${file.blobName} successfully`);
      console.log(`   🆔 Request ID: ${uploadResponse.requestId}`);
      
      return { success: true, action, file: file.blobName };
    } catch (error) {
      console.error(`❌ Failed to upload ${file.blobName}:`, error.message);
      return { success: false, action: 'Failed', file: file.blobName, error: error.message };
    }
  }

  getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes = {
      '.json': 'application/json',
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf'
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  async syncAllFiles() {
    console.log('🚀 Starting data sync from local to Azure Blob Storage\n');
    console.log('🔧 Configuration:');
    console.log(`   Local Directory: ${LOCAL_DATA_DIR}`);
    console.log(`   Storage Account: ${STORAGE_ACCOUNT_NAME}`);
    console.log(`   Container: ${CONTAINER_NAME}`);
    console.log('=' .repeat(60));

    // Step 1: Verify connection
    const connected = await this.verifyConnection();
    if (!connected) {
      console.log('❌ Cannot proceed - connection failed');
      return;
    }

    // Step 2: Get local files
    const localFiles = await this.getLocalFiles();
    if (localFiles.length === 0) {
      console.log('⚠️  No files found to sync');
      return;
    }

    // Step 3: Get existing blobs
    const existingBlobs = await this.getExistingBlobs();

    // Step 4: Upload all files
    console.log('\n📤 Starting file uploads...');
    console.log('-' .repeat(50));

    const results = {
      uploaded: 0,
      updated: 0,
      overwritten: 0,
      skipped: 0,
      failed: 0,
      errors: []
    };

    for (const file of localFiles) {
      const result = await this.uploadFile(file, existingBlobs);
      
      if (result.success) {
        switch (result.action) {
          case 'Uploading':
            results.uploaded++;
            break;
          case 'Updating':
            results.updated++;
            break;
          case 'Overwriting':
            results.overwritten++;
            break;
          case 'Skipped':
            results.skipped++;
            break;
        }
      } else {
        results.failed++;
        results.errors.push({ file: result.file, error: result.error });
      }

      // Small delay to avoid overwhelming the API (only for actual uploads)
      if (result.action !== 'Skipped') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Step 5: Show final summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Sync Summary:');
    console.log(`   📤 New files uploaded: ${results.uploaded}`);
    console.log(`   🔄 Files updated: ${results.updated}`);
    console.log(`   ♻️  Files overwritten: ${results.overwritten}`);
    console.log(`   ⏭️  Files skipped (same): ${results.skipped}`);
    console.log(`   ❌ Failed uploads: ${results.failed}`);
    console.log(`   📋 Total processed: ${localFiles.length}`);

    if (results.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      results.errors.forEach(error => {
        console.log(`   • ${error.file}: ${error.error}`);
      });
    }

    const successCount = results.uploaded + results.updated + results.overwritten + results.skipped;
    if (successCount === localFiles.length) {
      console.log('\n🎉 All files processed successfully!');
      if (results.skipped > 0) {
        console.log(`   ⚡ Efficiency: ${results.skipped} files skipped (already up to date)`);
      }
    } else {
      console.log(`\n⚠️  ${successCount}/${localFiles.length} files processed successfully`);
    }

    console.log('\n💡 Next steps:');
    console.log('   • Test your application with Azure Blob Storage');
    console.log('   • Consider setting up automated sync for new files');
    console.log('   • Verify all files are accessible through your app');
  }
}

// Run the sync
const syncer = new DataSyncToAzure();
syncer.syncAllFiles().catch(console.error);
