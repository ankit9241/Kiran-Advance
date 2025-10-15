const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please add response content']
  },
  isTutor: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DoubtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'resolved', 'cancelled'],
    default: 'pending'
  },
  responses: [ResponseSchema],
  acceptedAt: Date,
  resolvedAt: Date,
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  },
  tags: [String],
  attachments: [
    {
      url: String,
      name: String,
      type: String
    }
  ]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Set acceptedAt when status changes to 'accepted'
DoubtSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'accepted' && !this.acceptedAt) {
    this.acceptedAt = Date.now();
  }
  
  // Set resolvedAt when status changes to 'resolved'
  if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = Date.now();
  }
  
  next();
});

// Cascade delete notifications when a doubt is deleted
DoubtSchema.pre('remove', async function(next) {
  await this.model('Notification').deleteMany({ referenceId: this._id });
  next();
});

// Reverse populate with virtuals
DoubtSchema.virtual('notifications', {
  ref: 'Notification',
  localField: '_id',
  foreignField: 'referenceId',
  justOne: false
});

// Static method to get average doubt resolution time
DoubtSchema.statics.getAverageResolutionTime = async function(tutorId) {
  const obj = await this.aggregate([
    {
      $match: { 
        tutor: tutorId,
        status: 'resolved',
        acceptedAt: { $exists: true },
        resolvedAt: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$tutor',
        averageTime: { 
          $avg: { 
            $subtract: ['$resolvedAt', '$acceptedAt'] 
          } 
        },
        count: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('User').findByIdAndUpdate(tutorId, {
      averageResolutionTime: obj[0] ? Math.ceil(obj[0].averageTime / (1000 * 60)) : 0, // in minutes
      totalResolvedDoubts: obj[0] ? obj[0].count : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageResolutionTime after save
DoubtSchema.post('save', function() {
  if (this.tutor && this.status === 'resolved') {
    this.constructor.getAverageResolutionTime(this.tutor);
  }
});

// Call getAverageResolutionTime after remove
DoubtSchema.post('remove', function() {
  if (this.tutor) {
    this.constructor.getAverageResolutionTime(this.tutor);
  }
});

module.exports = mongoose.model('Doubt', DoubtSchema);
