const mongoose = require('mongoose');
const User = require('./base/User');
const { generateNextId } = require('../utils/idGenerator');

// Pre-save hook to generate mentor ID
const generateMentorId = async function(next) {
  if (!this.isNew) return next();
  
  try {
    this.mentorId = await generateNextId('mentor');
    next();
  } catch (error) {
    next(error);
  }
};

// Mentor Schema that extends the base User
const MentorSchema = new mongoose.Schema({
  // Approval status for mentors (false by default, needs admin approval)
  isApproved: {
    type: Boolean,
    default: false
  },
  // Auto-generated mentor registration ID (e.g., MEN2025001)
  mentorId: {
    type: String,
    unique: true,
    required: true,
    index: true,
    immutable: true
  },
  
  // Mentor-specific fields
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  expertise: [{
    type: String,
    required: [true, 'Please add at least one area of expertise']
  }],
  education: [{
    degree: {
      type: String,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  experience: [{
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    from: {
      type: Date,
      required: true
    },
    to: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: String
  }],
  availability: {
    type: Map,
    of: [{
      start: String, // Format: "HH:MM"
      end: String    // Format: "HH:MM"
    }]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  hourlyRate: {
    type: Number,
    min: 0
  }
});

// Set the role to 'mentor' by default
MentorSchema.pre('save', function(next) {
  this.role = 'mentor';
  next();
});

// Add pre-save hook to generate mentor ID
MentorSchema.pre('save', generateMentorId);

// Create text index for search functionality
MentorSchema.index({ mentorId: 'text', name: 'text', email: 'text' });

// Add static method to find by mentorId
MentorSchema.statics.findByMentorId = function(mentorId) {
  return this.findOne({ mentorId });
};

// Add static method to find by email
MentorSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

module.exports = User.discriminator('Mentor', MentorSchema);
