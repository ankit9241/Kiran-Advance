const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all notifications for logged in user
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  // Check if user is admin to get all notifications
  const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
  
  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Get unread notifications count
// @route   GET /api/v1/notifications/unread-count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    user: req.user.id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    count
  });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { 
      isRead: true,
      readAt: Date.now()
    },
    { new: true, runValidators: true }
  );

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is notification owner or admin
  if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this notification`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { 
      isRead: true,
      readAt: Date.now()
    }
  );

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is notification owner or admin
  if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this notification`,
        401
      )
    );
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete all notifications
// @route   DELETE /api/v1/notifications
// @access  Private
exports.clearAllNotifications = asyncHandler(async (req, res, next) => {
  await Notification.deleteMany({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Create broadcast notification (Admin only)
// @route   POST /api/v1/notifications/broadcast
// @access  Private/Admin
exports.createBroadcastNotification = asyncHandler(async (req, res, next) => {
  const { title, message, type = 'announcement' } = req.body;

  if (!title || !message) {
    return next(
      new ErrorResponse('Please provide both title and message', 400)
    );
  }

  // Create notification for all users
  const notification = await Notification.create({
    title,
    message,
    type,
    isBroadcast: true,
    isRead: false
  });

  res.status(201).json({
    success: true,
    data: notification
  });
});
