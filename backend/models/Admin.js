const mongoose = require('mongoose');
const User = require('./base/User');

// Admin Schema that extends the base User
const AdminSchema = new mongoose.Schema({
  // Admin-specific fields
  permissions: {
    type: [String],
    enum: [
      'manage_users',
      'manage_content',
      'manage_settings',
      'view_analytics',
      'manage_payments'
    ],
    default: ['view_analytics']
  },
  department: {
    type: String,
    enum: ['technical', 'academic', 'operations', 'support', 'management'],
    required: true
  },
  canImpersonate: {
    type: Boolean,
    default: false
  },
  lastImpersonation: Date
});

// Set the role to 'admin' by default
AdminSchema.pre('save', function(next) {
  this.role = 'admin';
  next();
});

module.exports = User.discriminator('Admin', AdminSchema);
