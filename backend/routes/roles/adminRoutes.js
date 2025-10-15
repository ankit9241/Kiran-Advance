const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const adminController = require('../../controllers/adminController');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Admin profile routes
router.route('/me')
  .get(adminController.getAdminProfile)
  .put(adminController.updateAdminProfile);

// @route   GET /api/admins/mentor-requests
// @desc    Get all pending mentor requests
// @access  Private/Admin
router.get('/mentor-requests', adminController.getMentorRequests);

// @route   PUT /api/admins/mentor-requests/:id
// @desc    Approve/Reject mentor request
// @access  Private/Admin
router.put('/mentor-requests/:id', adminController.handleMentorRequest);

// @route   GET /api/admins/student-registrations
// @desc    Get recent student registrations
// @access  Private/Admin
router.get('/student-registrations', adminController.getStudentRegistrations);

// @route   GET /api/admins/notifications
// @desc    Get admin notifications
// @access  Private/Admin
router.get('/notifications', adminController.getAdminNotifications);

// Dashboard route
router.get('/dashboard', adminController.getAdminDashboard);

// User management routes
router.get('/users', adminController.getAllUsers);

module.exports = router;
