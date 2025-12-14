const fs = require('fs').promises;
const path = require('path');

/**
 * Delete a file from the filesystem
 * @param {string} filePath - Path to the file to delete
 * @returns {Promise<boolean>} - True if deleted, false if file doesn't exist
 */
async function deleteFile(filePath) {
  if (!filePath) return false;
  
  try {
    // Convert URL path to absolute file path
    const absolutePath = filePath.startsWith('/uploads')
      ? path.join(__dirname, '..', filePath)
      : filePath;
    
    await fs.unlink(absolutePath);
    console.log(`✅ Deleted file: ${filePath}`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⚠️ File not found: ${filePath}`);
      return false;
    }
    console.error(`❌ Error deleting file ${filePath}:`, error);
    return false;
  }
}

/**
 * Delete multiple files from the filesystem
 * @param {string[]} filePaths - Array of file paths to delete
 * @returns {Promise<Object>} - Object with success and failure counts
 */
async function deleteFiles(filePaths) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    return { success: 0, failed: 0 };
  }

  const results = await Promise.allSettled(
    filePaths.map(filePath => deleteFile(filePath))
  );

  const summary = results.reduce((acc, result) => {
    if (result.status === 'fulfilled' && result.value) {
      acc.success++;
    } else {
      acc.failed++;
    }
    return acc;
  }, { success: 0, failed: 0 });

  console.log(`🗑️ Deleted ${summary.success} files, ${summary.failed} failed`);
  return summary;
}

/**
 * Delete a directory and all its contents
 * @param {string} dirPath - Path to the directory to delete
 * @returns {Promise<boolean>} - True if deleted successfully
 */
async function deleteDirectory(dirPath) {
  if (!dirPath) return false;

  try {
    const absolutePath = dirPath.startsWith('/uploads')
      ? path.join(__dirname, '..', dirPath)
      : dirPath;

    await fs.rm(absolutePath, { recursive: true, force: true });
    console.log(`✅ Deleted directory: ${dirPath}`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⚠️ Directory not found: ${dirPath}`);
      return false;
    }
    console.error(`❌ Error deleting directory ${dirPath}:`, error);
    return false;
  }
}

module.exports = {
  deleteFile,
  deleteFiles,
  deleteDirectory
};
