const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');

try {
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at: ${uploadsDir}`);
  } else {
    console.log(`Uploads directory already exists at: ${uploadsDir}`);
  }
  
  // Set directory permissions (read, write, execute for owner; read, execute for group/others)
  fs.chmodSync(uploadsDir, 0o755);
  console.log('Set directory permissions to 755');
  
  console.log('Uploads directory setup completed successfully');
} catch (error) {
  console.error('Error setting up uploads directory:', error);
  process.exit(1);
}
