const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [
      function() { return !this.isBroadcast; },
      'User is required for non-broadcast notifications'
    ]
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify notification type'],
    enum: [
      'new_doubt',
      'doubt_status',
      'doubt_response',
      'meeting_scheduled',
      'meeting_reminder',
      'meeting_updated',
      'meeting_cancelled',
      'new_material',
      'new_feedback',
      'system_alert',
      'announcement',
      'payment_received',
      'payment_failed',
      'account_activity',
      'other'
    ],
    default: 'other'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isBroadcast: {
    type: Boolean,
    default: false
  },
  referenceId: {
    type: mongoose.Schema.ObjectId,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    enum: ['Doubt', 'Meeting', 'Material', 'Feedback', 'User', 'Payment'],
    required: [
      function() { return !!this.referenceId; },
      'Reference model is required when referenceId is provided'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  actionUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  metadata: {
    type: Map,
    of: String
  },
  expiresAt: {
    type: Date,
    default: function() {
      const now = new Date();
      // Default expiration: 30 days from now
      return new Date(now.setDate(now.getDate() + 30));
    }
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  delivered: {
    type: Boolean,
    default: false
  },
  deliveryMethod: {
    type: [String],
    enum: ['in_app', 'email', 'sms', 'push'],
    default: ['in_app']
  },
  category: {
    type: String,
    enum: ['system', 'user', 'admin', 'marketing'],
    default: 'system'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
NotificationSchema.index({ user: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ isBroadcast: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to mark notifications as read
NotificationSchema.statics.markAsRead = async function(notificationIds, userId) {
  return this.updateMany(
    {
      _id: { $in: notificationIds },
      user: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: Date.now()
      }
    }
  );
};

// Static method to create a broadcast notification
NotificationSchema.statics.createBroadcast = async function(notificationData) {
  const { title, message, type, priority = 'medium', expiresInDays = 30 } = notificationData;
  
  const notification = new this({
    title,
    message,
    type,
    priority,
    isBroadcast: true,
    expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
    ...notificationData
  });

  return notification.save();
};

// Method to check if notification is expired
NotificationSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

// Pre-save hook to set default title based on type if not provided
NotificationSchema.pre('save', function(next) {
  if (!this.title) {
    const titles = {
      new_doubt: 'New Doubt Posted',
      doubt_status: 'Doubt Status Updated',
      doubt_response: 'New Response on Your Doubt',
      meeting_scheduled: 'Meeting Scheduled',
      meeting_reminder: 'Meeting Reminder',
      meeting_updated: 'Meeting Updated',
      meeting_cancelled: 'Meeting Cancelled',
      new_material: 'New Study Material Available',
      new_feedback: 'New Feedback Received',
      system_alert: 'System Alert',
      announcement: 'New Announcement',
      payment_received: 'Payment Received',
      payment_failed: 'Payment Failed',
      account_activity: 'Account Activity',
      other: 'Notification'
    };
    
    this.title = titles[this.type] || 'New Notification';
  }
  
  next();
});

// Static method to get unread count for a user
NotificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({
    user: userId,
    isRead: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

module.exports = mongoose.model('Notification', NotificationSchema);
