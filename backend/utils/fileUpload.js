const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);

// Ensure upload directory exists
const ensureUploadsDir = async () => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'profile-pictures');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error('Error creating upload directory:', err);
      throw err;
    }
  }
  return uploadDir;
};

// Handle file upload
const uploadFile = async (file, userId) => {
  try {
    const uploadDir = await ensureUploadsDir();
    
    // Generate unique filename
    const fileExt = path.extname(file.originalname).toLowerCase();
    const fileName = `student-${userId}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Move the file
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      writeStream.write(file.buffer);
      writeStream.end();
    });
    
    return `/uploads/profile-pictures/${fileName}`;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw new Error('Failed to upload file');
  }
};

// Delete file
const deleteFile = async (filePath) => {
  if (!filePath || filePath === 'default.jpg') return;
  
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await unlink(fullPath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error deleting file:', err);
      throw err;
    }
  }
};

module.exports = {
  uploadFile,
  deleteFile
};
