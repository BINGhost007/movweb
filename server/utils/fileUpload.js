const path = require('path');
const fs = require('fs');

const uploadFile = (file, uploadPath = 'uploads') => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(__dirname, '..', uploadPath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const ext = path.extname(file.name);
    const filename = `${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Move file to upload directory
    file.mv(filePath, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return reject(new Error('File upload failed'));
      }

      // Return relative path
      resolve(`/${uploadPath}/${filename}`);
    });
  });
};

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      return resolve();
    }

    const fullPath = path.join(__dirname, '..', filePath);
    
    // Check if file exists before deleting
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error('File deletion error:', err);
          return reject(new Error('File deletion failed'));
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
};

module.exports = { uploadFile, deleteFile };