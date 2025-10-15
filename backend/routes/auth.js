const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const fileUpload = require('express-fileupload');

// Configure file upload middleware
const uploadOptions = {
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  useTempFiles: true,
  tempFileDir: '/tmp/',
  safeFileNames: true,
  preserveExtension: 4, // Keep .jpeg, .png, etc.
};

// Public routes
router.post('/register', 
  fileUpload(uploadOptions),
  authController.register
);
router.post('/login', authController.login);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);

// Debug route to check current user
router.get('/debug/me', (req, res) => {
  console.log('Current user from req.user:', req.user);
  res.json({
    success: true,
    user: req.user ? {
      id: req.user.id,
      role: req.user.role,
      email: req.user.email,
      // Add other relevant fields
    } : null
  });
});

// Handle file upload for profile picture
router.put('/updatedetails', 
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    useTempFiles: true,
    tempFileDir: '/tmp/',
    safeFileNames: true,
    preserveExtension: 4, // Keep .jpeg, .png, etc.
  }),
  authController.updateDetails
);

router.put('/updatepassword', authController.updatePassword);

module.exports = router;
