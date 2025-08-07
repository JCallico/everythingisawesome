import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import path from 'path';

/**
 * AzureBlobFileSystem
 * Implementation that uses Azure Blob Storage for file operations
 */
export class AzureBlobFileSystem {
  constructor(config) {
    const { accountName, accountKey, containerName } = config;
    
    if (!accountName || !accountKey || !containerName) {
      throw new Error('Azure Storage configuration is incomplete. Required: accountName, accountKey, containerName');
    }
    
    this.accountName = accountName;
    this.containerName = containerName;
    this.basePath = '';
    this.imagesPath = 'generated-images';
    
    // Initialize Azure client
    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    this.blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );
    this.containerClient = this.blobServiceClient.getContainerClient(containerName);
  }

  // Core file operations
  async read(filePath, encoding = 'utf8') {
    const blobPath = this._normalizeBlobPath(filePath);
    const blobClient = this.containerClient.getBlockBlobClient(blobPath);
    
    try {
      const downloadResponse = await blobClient.download();
      
      if (encoding === null) {
        // Return buffer for binary data
        return await this._streamToBuffer(downloadResponse.readableStreamBody);
      } else {
        // Return string for text data
        const content = await this._streamToString(downloadResponse.readableStreamBody);
        return content;
      }
    } catch (error) {
      if (error.statusCode === 404) {
        throw new Error(`File not found: ${blobPath}`);
      }
      throw error;
    }
  }

  async write(filePath, data, options = {}) {
    const blobPath = this._normalizeBlobPath(filePath);
    const blobClient = this.containerClient.getBlockBlobClient(blobPath);
    
    // Determine content type
    const contentType = this._getContentType(filePath);
    
    // Convert data to buffer if it's a string
    const content = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
    
    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: contentType
      },
      tags: {
        'source': 'everythingisawesome-app',
        'uploaded': new Date().toISOString()
      },
      ...options
    };
    
    return await blobClient.upload(content, content.length, uploadOptions);
  }

  async exists(filePath) {
    const blobPath = this._normalizeBlobPath(filePath);
    const blobClient = this.containerClient.getBlockBlobClient(blobPath);
    
    try {
      await blobClient.getProperties();
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async delete(filePath) {
    const blobPath = this._normalizeBlobPath(filePath);
    const blobClient = this.containerClient.getBlockBlobClient(blobPath);
    
    try {
      await blobClient.delete();
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async copy(sourcePath, destinationPath) {
    const sourceBlobPath = this._normalizeBlobPath(sourcePath);
    const destBlobPath = this._normalizeBlobPath(destinationPath);
    
    const sourceBlobClient = this.containerClient.getBlockBlobClient(sourceBlobPath);
    const destBlobClient = this.containerClient.getBlockBlobClient(destBlobPath);
    
    // Copy using Azure blob copy operation
    const copyPoller = await destBlobClient.beginCopyFromURL(sourceBlobClient.url);
    return await copyPoller.pollUntilDone();
  }

  async move(sourcePath, destinationPath) {
    // Move = copy + delete
    await this.copy(sourcePath, destinationPath);
    return await this.delete(sourcePath);
  }

  // Directory operations
  async listFiles(dirPath = '') {
    const prefix = this._normalizeBlobPath(dirPath);
    const options = {
      prefix: prefix ? `${prefix}/` : '',
      includeMetadata: true
    };
    
    const result = [];
    
    for await (const blob of this.containerClient.listBlobsFlat(options)) {
      // Skip if it's a directory marker (ends with /)
      if (blob.name.endsWith('/')) continue;
      
      // Extract relative path
      const relativePath = prefix ? blob.name.substring(prefix.length + 1) : blob.name;
      
      // Skip if it contains subdirectories (we only want direct files)
      if (relativePath.includes('/')) continue;
      
      result.push({
        name: path.basename(blob.name),
        path: blob.name,
        size: blob.properties.contentLength,
        modified: blob.properties.lastModified,
        isDirectory: false,
        contentType: blob.properties.contentType
      });
    }
    
    return result;
  }

  async listDirectories(dirPath = '') {
    const prefix = this._normalizeBlobPath(dirPath);
    const options = {
      prefix: prefix ? `${prefix}/` : ''
    };
    
    const directories = new Set();
    
    for await (const blob of this.containerClient.listBlobsFlat(options)) {
      const relativePath = prefix ? blob.name.substring(prefix.length + 1) : blob.name;
      const firstSlashIndex = relativePath.indexOf('/');
      
      if (firstSlashIndex > 0) {
        const dirName = relativePath.substring(0, firstSlashIndex);
        directories.add(dirName);
      }
    }
    
    return Array.from(directories).map(name => ({
      name,
      path: prefix ? `${prefix}/${name}` : name,
      isDirectory: true
    }));
  }

  async createDirectory(dirPath) {
    // Azure Blob Storage doesn't have true directories
    // We create a placeholder file to represent the directory
    const markerPath = `${this._normalizeBlobPath(dirPath)}/.keep`;
    return await this.write(markerPath, '', {
      blobHTTPHeaders: {
        blobContentType: 'text/plain'
      }
    });
  }

  async deleteDirectory(dirPath) {
    const prefix = this._normalizeBlobPath(dirPath);
    const options = {
      prefix: `${prefix}/`
    };
    
    const deletePromises = [];
    
    for await (const blob of this.containerClient.listBlobsFlat(options)) {
      const blobClient = this.containerClient.getBlockBlobClient(blob.name);
      deletePromises.push(blobClient.delete());
    }
    
    return await Promise.all(deletePromises);
  }

  // Synchronous operations (compatibility - these will be async internally)
  existsSync(_filePath) {
    // Note: This is not truly synchronous but needed for compatibility
    console.warn('existsSync is not truly synchronous with Azure Blob Storage');
    return false;
  }

  readdirSync(_dirPath = '') {
    // Note: This is not truly synchronous but needed for compatibility
    console.warn('readdirSync is not truly synchronous with Azure Blob Storage');
    return [];
  }

  mkdirSync(_dirPath, _options = {}) {
    // Note: This is not truly synchronous but needed for compatibility
    console.warn('mkdirSync is not truly synchronous with Azure Blob Storage');
    return;
  }

  ensureDirSync(_dirPath) {
    // Note: This is not truly synchronous but needed for compatibility
    console.warn('ensureDirSync is not truly synchronous with Azure Blob Storage');
    return;
  }

  // Utility methods
  getBasePath() {
    return this.basePath;
  }

  getImagesPath() {
    return this.imagesPath;
  }

  // Private helpers
  _normalizeBlobPath(filePath) {
    // Remove leading slashes and normalize path separators
    return filePath.replace(/^\/+/, '').replace(/\\/g, '/');
  }

  _getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
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

  async _streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
        chunks.push(data.toString());
      });
      readableStream.on('end', () => {
        resolve(chunks.join(''));
      });
      readableStream.on('error', reject);
    });
  }

  async _streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
        chunks.push(data);
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  }
}
