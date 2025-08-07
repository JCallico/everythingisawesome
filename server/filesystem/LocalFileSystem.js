import fs from 'fs-extra';
import path from 'path';

/**
 * LocalFileSystem
 * Implementation that uses the local file system for storage operations
 */
export class LocalFileSystem {
  constructor(basePath = './data') {
    this.basePath = path.resolve(basePath);
    this.imagesPath = path.join(this.basePath, 'generated-images');
    
    // Ensure directories exist
    fs.ensureDirSync(this.basePath);
    fs.ensureDirSync(this.imagesPath);
  }

  // Core file operations
  async read(filePath, encoding = 'utf8') {
    const fullPath = this._getFullPath(filePath);
    return await fs.readFile(fullPath, encoding);
  }

  async write(filePath, data, options = {}) {
    const fullPath = this._getFullPath(filePath);
    await fs.ensureDir(path.dirname(fullPath));
    return await fs.writeFile(fullPath, data, options);
  }

  async exists(filePath) {
    const fullPath = this._getFullPath(filePath);
    return await fs.pathExists(fullPath);
  }

  async delete(filePath) {
    const fullPath = this._getFullPath(filePath);
    return await fs.remove(fullPath);
  }

  async copy(sourcePath, destinationPath) {
    const fullSourcePath = this._getFullPath(sourcePath);
    const fullDestPath = this._getFullPath(destinationPath);
    await fs.ensureDir(path.dirname(fullDestPath));
    return await fs.copy(fullSourcePath, fullDestPath);
  }

  async move(sourcePath, destinationPath) {
    const fullSourcePath = this._getFullPath(sourcePath);
    const fullDestPath = this._getFullPath(destinationPath);
    await fs.ensureDir(path.dirname(fullDestPath));
    return await fs.move(fullSourcePath, fullDestPath);
  }

  // Directory operations
  async listFiles(dirPath = '') {
    const fullPath = this._getFullPath(dirPath);
    const items = await fs.readdir(fullPath);
    const result = [];
    
    for (const item of items) {
      const itemPath = path.join(fullPath, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isFile()) {
        result.push({
          name: item,
          path: dirPath ? `${dirPath}/${item}` : item,
          size: stats.size,
          modified: stats.mtime,
          isDirectory: false
        });
      }
    }
    
    return result;
  }

  async listDirectories(dirPath = '') {
    const fullPath = this._getFullPath(dirPath);
    const items = await fs.readdir(fullPath);
    const result = [];
    
    for (const item of items) {
      const itemPath = path.join(fullPath, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        result.push({
          name: item,
          path: dirPath ? `${dirPath}/${item}` : item,
          isDirectory: true
        });
      }
    }
    
    return result;
  }

  async createDirectory(dirPath) {
    const fullPath = this._getFullPath(dirPath);
    return await fs.ensureDir(fullPath);
  }

  async deleteDirectory(dirPath) {
    const fullPath = this._getFullPath(dirPath);
    return await fs.remove(fullPath);
  }

  // Synchronous operations (for compatibility)
  existsSync(filePath) {
    const fullPath = this._getFullPath(filePath);
    return fs.existsSync(fullPath);
  }

  readdirSync(dirPath = '') {
    const fullPath = this._getFullPath(dirPath);
    return fs.readdirSync(fullPath);
  }

  mkdirSync(dirPath, options = { recursive: true }) {
    const fullPath = this._getFullPath(dirPath);
    return fs.mkdirSync(fullPath, options);
  }

  ensureDirSync(dirPath) {
    const fullPath = this._getFullPath(dirPath);
    return fs.ensureDirSync(fullPath);
  }

  // Utility methods
  getBasePath() {
    return this.basePath;
  }

  getImagesPath() {
    return this.imagesPath;
  }

  // Private helper
  _getFullPath(filePath) {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    return path.join(this.basePath, filePath);
  }
}
