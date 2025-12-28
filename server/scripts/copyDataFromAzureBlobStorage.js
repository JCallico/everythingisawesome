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
const LOCAL_IMAGES_DIR = path.join(LOCAL_DATA_DIR, 'generated-images');

// Validate environment variables
if (!STORAGE_ACCOUNT_NAME || !CONTAINER_NAME || !STORAGE_ACCOUNT_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   AZURE_STORAGE_ACCOUNT_NAME:', !!STORAGE_ACCOUNT_NAME);
  console.error('   AZURE_STORAGE_CONTAINER_NAME:', !!CONTAINER_NAME);
  console.error('   AZURE_STORAGE_ACCOUNT_KEY:', !!STORAGE_ACCOUNT_KEY);
  console.error('   Please check your .env file');
  process.exit(1);
}

class DataDownloadFromAzure {
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

  async getRemoteFiles() {
    console.log('🔍 Scanning remote blobs in container...');
    try {
      const remoteFiles = {
        jsonFiles: [],
        imageFiles: []
      };

      for await (const blob of this.containerClient.listBlobsFlat()) {
        // Include JSON files (data files in root)
        if (blob.name.endsWith('.json') && !blob.name.includes('/')) {
          remoteFiles.jsonFiles.push({
            name: path.basename(blob.name),
            blobName: blob.name,
            size: blob.properties.contentLength,
            lastModified: blob.properties.lastModified,
            etag: blob.properties.etag
          });
        }
        // Include image files from generated-images folder
        else if (blob.name.startsWith('generated-images/')) {
          remoteFiles.imageFiles.push({
            name: path.basename(blob.name),
            blobName: blob.name,
            size: blob.properties.contentLength,
            lastModified: blob.properties.lastModified,
            etag: blob.properties.etag
          });
        }
      }

      console.log(`📦 Found ${remoteFiles.jsonFiles.length} JSON data files in remote storage`);
      if (remoteFiles.jsonFiles.length > 0) {
        console.log('   Data files:');
        remoteFiles.jsonFiles.forEach(file => {
          console.log(`   📄 ${file.name} (${file.size} bytes)`);
        });
      }

      console.log(`📦 Found ${remoteFiles.imageFiles.length} image files in remote storage`);
      if (remoteFiles.imageFiles.length > 0) {
        console.log('   Image files:');
        remoteFiles.imageFiles.slice(0, 10).forEach(file => {
          console.log(`   🖼️  ${file.name} (${file.size} bytes)`);
        });
        if (remoteFiles.imageFiles.length > 10) {
          console.log(`   ... and ${remoteFiles.imageFiles.length - 10} more images`);
        }
      }

      return remoteFiles;
    } catch (error) {
      console.error('❌ Failed to list remote blobs:', error.message);
      return { jsonFiles: [], imageFiles: [] };
    }
  }

  async getLocalFiles() {
    console.log(`📂 Scanning local data directory: ${LOCAL_DATA_DIR}`);
    try {
      const localFiles = {
        jsonFiles: new Map(),
        imageFiles: new Map()
      };

      // Scan root for JSON files
      if (await fs.pathExists(LOCAL_DATA_DIR)) {
        const rootFiles = await fs.readdir(LOCAL_DATA_DIR);
        for (const file of rootFiles) {
          if (file.endsWith('.json')) {
            const filePath = path.join(LOCAL_DATA_DIR, file);
            const stats = await fs.stat(filePath);
            if (stats.isFile()) {
              localFiles.jsonFiles.set(file, {
                name: file,
                path: filePath,
                size: stats.size,
                modified: stats.mtime
              });
            }
          }
        }
      }

      // Scan generated-images folder
      if (await fs.pathExists(LOCAL_IMAGES_DIR)) {
        const files = await fs.readdir(LOCAL_IMAGES_DIR);
        for (const file of files) {
          const filePath = path.join(LOCAL_IMAGES_DIR, file);
          const stats = await fs.stat(filePath);
          if (stats.isFile()) {
            localFiles.imageFiles.set(file, {
              name: file,
              path: filePath,
              size: stats.size,
              modified: stats.mtime
            });
          }
        }
      } else {
        console.log('   ℹ️  Local images directory does not exist yet (will be created)');
      }

      console.log(`📋 Found ${localFiles.jsonFiles.size} local JSON files`);
      if (localFiles.jsonFiles.size > 0) {
        console.log('   Local data files:');
        for (const [name, file] of localFiles.jsonFiles) {
          console.log(`   📄 ${name} (${file.size} bytes)`);
        }
      }

      console.log(`📋 Found ${localFiles.imageFiles.size} local image files`);
      if (localFiles.imageFiles.size > 0) {
        console.log('   (images will be checked during download)');
      }

      return localFiles;
    } catch (error) {
      console.error('❌ Failed to scan local directory:', error.message);
      return { jsonFiles: new Map(), imageFiles: new Map() };
    }
  }

  async downloadFile(remoteFile, localFiles, fileType) {
    try {
      const fileName = remoteFile.name;
      const localMap = fileType === 'json' ? localFiles.jsonFiles : localFiles.imageFiles;
      const existingLocal = localMap.get(fileName);
      let action = 'Downloading';
      const targetDir = fileType === 'json' ? LOCAL_DATA_DIR : LOCAL_IMAGES_DIR;

      if (existingLocal) {
        if (existingLocal.size === remoteFile.size) {
          // File exists with same size, skip download
          console.log(`⏭️  Skipping ${fileName}... (same size: ${remoteFile.size} bytes)`);
          return { success: true, action: 'Skipped', file: fileName };
        } else {
          action = 'Overwriting';
        }
      } else {
        action = 'Downloading';
      }

      const blobClient = this.containerClient.getBlobClient(remoteFile.blobName);
      const downloadResponse = await blobClient.download();
      
      // Ensure directory exists
      await fs.ensureDir(targetDir);

      const filePath = path.join(targetDir, fileName);
      const buffer = await this.streamToBuffer(downloadResponse.readableStreamBody);
      
      const icon = fileType === 'json' ? '📄' : '🖼️';
      console.log(`📥 ${action} ${icon} ${fileName}... (${remoteFile.size} bytes)`);
      
      await fs.writeFile(filePath, buffer);

      console.log(`✅ ${action.slice(0, -3)}ed ${fileName} successfully`);
      
      return { success: true, action, file: fileName };
    } catch (error) {
      console.error(`❌ Failed to download ${remoteFile.name}:`, error.message);
      return { success: false, action: 'Failed', file: remoteFile.name, error: error.message };
    }
  }

  async streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  }

  async downloadAllData() {
    console.log('🚀 Starting data sync from Azure Blob Storage to local\n');
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

    // Step 2: Get remote files
    const remoteFiles = await this.getRemoteFiles();
    const totalRemoteFiles = remoteFiles.jsonFiles.length + remoteFiles.imageFiles.length;
    
    if (totalRemoteFiles === 0) {
      console.log('⚠️  No files found in remote storage to download');
      return;
    }

    // Step 3: Get local files
    const localFiles = await this.getLocalFiles();

    // Step 4: Download all files
    console.log('\n📥 Starting downloads...');
    console.log('-' .repeat(50));

    const results = {
      jsonDownloaded: 0,
      jsonUpdated: 0,
      jsonOverwritten: 0,
      jsonSkipped: 0,
      jsonFailed: 0,
      imageDownloaded: 0,
      imageUpdated: 0,
      imageOverwritten: 0,
      imageSkipped: 0,
      imageFailed: 0,
      errors: []
    };

    // Download JSON files first
    if (remoteFiles.jsonFiles.length > 0) {
      console.log('\n📄 Downloading JSON data files...');
      for (const remoteFile of remoteFiles.jsonFiles) {
        const result = await this.downloadFile(remoteFile, localFiles, 'json');
        
        if (result.success) {
          switch (result.action) {
          case 'Downloading':
            results.jsonDownloaded++;
            break;
          case 'Updating':
            results.jsonUpdated++;
            break;
          case 'Overwriting':
            results.jsonOverwritten++;
            break;
          case 'Skipped':
            results.jsonSkipped++;
            break;
          }
        } else {
          results.jsonFailed++;
          results.errors.push({ file: result.file, error: result.error });
        }

        if (result.action !== 'Skipped') {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    // Download image files
    if (remoteFiles.imageFiles.length > 0) {
      console.log('\n🖼️  Downloading generated images...');
      for (const remoteFile of remoteFiles.imageFiles) {
        const result = await this.downloadFile(remoteFile, localFiles, 'image');
        
        if (result.success) {
          switch (result.action) {
          case 'Downloading':
            results.imageDownloaded++;
            break;
          case 'Updating':
            results.imageUpdated++;
            break;
          case 'Overwriting':
            results.imageOverwritten++;
            break;
          case 'Skipped':
            results.imageSkipped++;
            break;
          }
        } else {
          results.imageFailed++;
          results.errors.push({ file: result.file, error: result.error });
        }

        if (result.action !== 'Skipped') {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    // Step 5: Show final summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Download Summary:\n');
    
    console.log('📄 JSON Data Files:');
    console.log(`   📥 New files downloaded: ${results.jsonDownloaded}`);
    console.log(`   🔄 Files updated: ${results.jsonUpdated}`);
    console.log(`   ♻️  Files overwritten: ${results.jsonOverwritten}`);
    console.log(`   ⏭️  Files skipped (same): ${results.jsonSkipped}`);
    console.log(`   ❌ Failed downloads: ${results.jsonFailed}`);
    
    console.log('\n🖼️  Generated Images:');
    console.log(`   📥 New images downloaded: ${results.imageDownloaded}`);
    console.log(`   🔄 Images updated: ${results.imageUpdated}`);
    console.log(`   ♻️  Images overwritten: ${results.imageOverwritten}`);
    console.log(`   ⏭️  Images skipped (same): ${results.imageSkipped}`);
    console.log(`   ❌ Failed downloads: ${results.imageFailed}`);

    const totalDownloaded = results.jsonDownloaded + results.imageDownloaded;
    const totalSkipped = results.jsonSkipped + results.imageSkipped;
    const totalFailed = results.jsonFailed + results.imageFailed;
    const totalSuccessful = totalDownloaded + totalSkipped + results.jsonUpdated + results.jsonOverwritten + results.imageUpdated + results.imageOverwritten;

    console.log('\n📋 Overall Summary:');
    console.log(`   📥 Total files downloaded: ${totalDownloaded}`);
    console.log(`   ⏭️  Total files skipped: ${totalSkipped}`);
    console.log(`   ❌ Total failed: ${totalFailed}`);
    console.log(`   ✅ Total successful: ${totalSuccessful}/${totalRemoteFiles}`);

    if (results.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      results.errors.forEach(error => {
        console.log(`   • ${error.file}: ${error.error}`);
      });
    }

    if (totalSuccessful === totalRemoteFiles) {
      console.log('\n🎉 All files downloaded successfully!');
      if (totalSkipped > 0) {
        console.log(`   ⚡ Efficiency: ${totalSkipped} files skipped (already up to date)`);
      }
    } else {
      console.log(`\n⚠️  ${totalSuccessful}/${totalRemoteFiles} files downloaded successfully`);
    }

    console.log('\n💡 Next steps:');
    console.log('   • Verify all data files are accessible locally');
    console.log(`   • Check the data folder: ${LOCAL_DATA_DIR}`);
    console.log(`   • Check the images folder: ${LOCAL_IMAGES_DIR}`);
    console.log('   • Test your application with downloaded data');
  }
}

// Run the download
const downloader = new DataDownloadFromAzure();
downloader.downloadAllData().catch(console.error);
