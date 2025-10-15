const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledTime: {
    type: Date,
    required: [true, 'Please add a scheduled time']
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Please add meeting duration']
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'missed'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  recordingUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot be more than 500 characters']
  },
  attachments: [
    {
      url: String,
      name: String,
      type: String
    }
  ],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate bookings for the same tutor and time slot
MeetingSchema.index(
  { tutor: 1, scheduledTime: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

// Prevent student from booking multiple meetings at the same time
MeetingSchema.index(
  { student: 1, scheduledTime: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

// Cascade delete notifications when a meeting is deleted
MeetingSchema.pre('remove', async function(next) {
  await this.model('Notification').deleteMany({ referenceId: this._id });
  next();
});

// Static method to get busy time slots for a tutor
MeetingSchema.statics.getBusySlots = async function(tutorId, startDate, endDate) {
  const meetings = await this.find({
    tutor: tutorId,
    status: { $ne: 'cancelled' },
    scheduledTime: {
      $gte: startDate,
      $lte: endDate
    }
  }).select('scheduledTime duration');

  return meetings.map(meeting => ({
    start: meeting.scheduledTime,
    end: new Date(meeting.scheduledTime.getTime() + meeting.duration * 60000)
  }));
};

// Virtual for meeting end time
MeetingSchema.virtual('endTime').get(function() {
  return new Date(this.scheduledTime.getTime() + this.duration * 60000);
});

// Reverse populate with virtuals
MeetingSchema.virtual('notifications', {
  ref: 'Notification',
  localField: '_id',
  foreignField: 'referenceId',
  justOne: false
});

// Calculate and update tutor's average rating after a meeting is rated
MeetingSchema.statics.calculateAverageRating = async function(tutorId) {
  const stats = await this.aggregate([
    {
      $match: { 
        tutor: tutorId,
        rating: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$tutor',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('User').findByIdAndUpdate(tutorId, {
      averageRating: stats[0] ? stats[0].averageRating : 0,
      totalRatings: stats[0] ? stats[0].totalRatings : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call calculateAverageRating after save
MeetingSchema.post('save', function() {
  if (this.rating) {
    this.constructor.calculateAverageRating(this.tutor);
  }
});

// Call calculateAverageRating after remove
MeetingSchema.post('remove', function() {
  if (this.rating) {
    this.constructor.calculateAverageRating(this.tutor);
  }
});

module.exports = mongoose.model('Meeting', MeetingSchema);
