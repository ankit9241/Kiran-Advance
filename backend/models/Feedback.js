const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  response: {
    text: {
      type: String,
      maxlength: [1000, 'Response cannot be more than 1000 characters']
    },
    respondedAt: Date
  },
  metadata: {
    ipAddress: String,
    userAgent: String
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    rating: Number,
    comment: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  helpfulCount: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    enum: ['spam', 'inappropriate', 'offensive', 'other'],
    default: 'other'
  },
  reportDetails: {
    type: String,
    maxlength: [500, 'Report details cannot be more than 500 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate feedback from same user for same tutor
FeedbackSchema.index(
  { user: 1, tutor: 1 },
  { unique: true }
);

// Add index for rating and status for faster queries
FeedbackSchema.index({ rating: 1 });
FeedbackSchema.index({ status: 1 });

// Add text index for search
FeedbackSchema.index({ comment: 'text' });

// Static method to get average rating for a tutor
FeedbackSchema.statics.getAverageRating = async function(tutorId) {
  const obj = await this.aggregate([
    {
      $match: { 
        tutor: tutorId,
        status: 'approved' // Only consider approved feedback
      }
    },
    {
      $group: {
        _id: '$tutor',
        averageRating: { $avg: '$rating' },
        totalFeedbacks: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('User').findByIdAndUpdate(tutorId, {
      averageRating: obj[0] ? obj[0].averageRating.toFixed(1) : 0,
      totalRatings: obj[0] ? obj[0].totalFeedbacks : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
FeedbackSchema.post('save', function() {
  this.constructor.getAverageRating(this.tutor);
});

// Call getAverageRating after remove
FeedbackSchema.post('remove', function() {
  this.constructor.getAverageRating(this.tutor);
});

// Save edit history before updating
FeedbackSchema.pre('save', function(next) {
  if (this.isModified('rating') || this.isModified('comment')) {
    if (!this.isNew) {
      this.editHistory.push({
        rating: this.rating,
        comment: this.comment,
        editedAt: new Date()
      });
      this.isEdited = true;
    }
  }
  next();
});

// Reverse populate with virtuals
FeedbackSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

FeedbackSchema.virtual('tutorDetails', {
  ref: 'User',
  localField: 'tutor',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
