const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const studentRoutes = require('./roles/studentRoutes');
const mentorProfileRoutes = require('./roles/mentorRoutes'); // Mentor profile/dashboard routes
const mentorPublicRoutes = require('./mentorRoutes'); // Public mentor routes (like getApprovedMentors)
const adminRoutes = require('./roles/adminRoutes');

// Mount routers
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);

// Public mentor routes (e.g., get approved mentors list)
router.use('/mentors', mentorPublicRoutes);

// Protected mentor profile/dashboard routes
router.use('/mentors', mentorProfileRoutes);

router.use('/admins', adminRoutes);

module.exports = router;
