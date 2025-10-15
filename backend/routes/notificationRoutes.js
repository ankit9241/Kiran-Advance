const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createBroadcastNotification,
  getBroadcastNotifications,
  deleteBroadcastNotification,
  getNotificationSettings,
  updateNotificationSettings
} = require('../controllers/notificationController');

const { protect, authorize } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Get user's notifications
router.get('/', getNotifications);

// Get unread notifications count
router.get('/unread-count', getUnreadCount);

// Mark notification as read
router.put('/:id/read', markAsRead);

// Mark all notifications as read
router.put('/read-all', markAllAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

// Clear all notifications
router.delete('/', clearAllNotifications);

// Notification settings
router.route('/settings')
  .get(getNotificationSettings)
  .put(updateNotificationSettings);

// Admin routes
router.use(authorize('admin'));

// Create broadcast notification (admin only)
router.post('/broadcast', createBroadcastNotification);

// Get all broadcast notifications
router.get('/broadcast', getBroadcastNotifications);

// Delete broadcast notification
router.delete('/broadcast/:id', deleteBroadcastNotification);

module.exports = router;
