const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { requireMentorApproval, addApprovalStatus } = require('../../middleware/mentorApproval');
const {
  getMentorProfile,
  updateMentorProfile,
  getMentorDashboard
} = require('../../controllers/roles/mentorController');

// All routes are protected and require authentication
router.use(protect);

// Add approval status to all mentor responses
router.use(addApprovalStatus);

// @route   GET /api/mentors/me
// @desc    Get current mentor's profile
// @access  Private
router.get('/me', getMentorProfile);

// @route   PUT /api/mentors/me
// @desc    Update mentor profile
// @access  Private
router.put('/me', updateMentorProfile);

// @route   GET /api/mentors/dashboard
// @desc    Get mentor dashboard data
// @access  Private
// Requires mentor approval
router.get('/dashboard', requireMentorApproval, getMentorDashboard);

module.exports = router;
