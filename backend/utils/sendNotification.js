const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Send notification to a single user
 * @param {Object} options - Notification options
 * @param {String} options.userId - ID of the user to notify
 * @param {String} options.title - Notification title
 * @param {String} options.message - Notification message
 * @param {String} options.type - Notification type
 * @param {String} [options.referenceId] - ID of the related document
 * @param {String} [options.referenceModel] - Model name of the related document
 * @param {String} [options.actionUrl] - URL for the notification action
 * @param {String} [options.priority='medium'] - Notification priority
 * @returns {Promise<Notification>} Created notification
 */
const sendUserNotification = async ({
  userId,
  title,
  message,
  type,
  referenceId,
  referenceModel,
  actionUrl,
  priority = 'medium'
}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      referenceId,
      referenceModel,
      actionUrl,
      priority
    });

    // Here you can add code to send push notifications, emails, etc.
    // For example: sendPushNotification(userId, { title, message });
    
    return notification;
  } catch (error) {
    console.error('Error sending user notification:', error);
    throw error;
  }
};

/**
 * Send notification to multiple users
 * @param {Object} options - Notification options
 * @param {String[]} options.userIds - Array of user IDs to notify
 * @param {String} options.title - Notification title
 * @param {String} options.message - Notification message
 * @param {String} options.type - Notification type
 * @param {String} [options.referenceId] - ID of the related document
 * @param {String} [options.referenceModel] - Model name of the related document
 * @param {String} [options.actionUrl] - URL for the notification action
 * @param {String} [options.priority='medium'] - Notification priority
 * @returns {Promise<Array>} Array of created notifications
 */
const sendBulkNotifications = async ({
  userIds,
  title,
  message,
  type,
  referenceId,
  referenceModel,
  actionUrl,
  priority = 'medium'
}) => {
  try {
    const notifications = [];
    
    for (const userId of userIds) {
      const notification = await sendUserNotification({
        userId,
        title,
        message,
        type,
        referenceId,
        referenceModel,
        actionUrl,
        priority
      });
      notifications.push(notification);
    }
    
    return notifications;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
};

/**
 * Send broadcast notification to all users or specific roles
 * @param {Object} options - Notification options
 * @param {String} options.title - Notification title
 * @param {String} options.message - Notification message
 * @param {String} options.type - Notification type
 * @param {String[]} [options.roles] - Array of roles to send notification to (if not provided, sends to all)
 * @param {String} [options.referenceId] - ID of the related document
 * @param {String} [options.referenceModel] - Model name of the related document
 * @param {String} [options.actionUrl] - URL for the notification action
 * @param {String} [options.priority='medium'] - Notification priority
 * @returns {Promise<Notification>} Created broadcast notification
 */
const sendBroadcastNotification = async ({
  title,
  message,
  type,
  roles,
  referenceId,
  referenceModel,
  actionUrl,
  priority = 'medium'
}) => {
  try {
    // Create a broadcast notification
    const notification = await Notification.create({
      title,
      message,
      type,
      isBroadcast: true,
      referenceId,
      referenceModel,
      actionUrl,
      priority,
      category: 'announcement'
    });

    // If specific roles are provided, find users with those roles
    if (roles && roles.length > 0) {
      const users = await User.find({ role: { $in: roles } }).select('_id');
      const userIds = users.map(user => user._id);
      
      // Here you can add code to send push notifications, emails, etc. to all users
      // For example: sendBulkPushNotifications(userIds, { title, message });
    } else {
      // For broadcast to all users
      // Here you can add code to send push notifications, emails, etc. to all users
      // For example: sendBulkPushNotificationsToAll({ title, message });
    }
    
    return notification;
  } catch (error) {
    console.error('Error sending broadcast notification:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {String} notificationId - ID of the notification
 * @param {String} userId - ID of the user
 * @returns {Promise<Notification>} Updated notification
 */
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId, isRead: false },
      { $set: { isRead: true, readAt: Date.now() } },
      { new: true }
    );
    
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all user notifications as read
 * @param {String} userId - ID of the user
 * @returns {Promise<Object>} Update result
 */
const markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true, readAt: Date.now() } }
    );
    
    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Get user's unread notifications count
 * @param {String} userId - ID of the user
 * @returns {Promise<Number>} Count of unread notifications
 */
const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    });
    
    return count;
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    throw error;
  }
};

module.exports = {
  sendUserNotification,
  sendBulkNotifications,
  sendBroadcastNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};
