const mongoose = require('mongoose');
const slugify = require('slugify');

const MaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'Please add a file URL'],
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  fileType: {
    type: String,
    required: [true, 'Please add a file type'],
    enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'video', 'audio', 'image', 'other']
  },
  fileSize: {
    type: Number,
    required: [true, 'Please add file size in bytes']
  },
  thumbnail: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  duration: {
    type: Number, // in seconds for video/audio
    default: 0
  },
  pages: {
    type: Number, // for documents
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isFree: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  tags: [String],
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  accessibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  },
  allowedRoles: [{
    type: String,
    enum: ['student', 'tutor', 'admin']
  }],
  allowedUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create material slug from the title
MaterialSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

// Set approvedAt when isApproved changes to true
MaterialSchema.pre('save', function(next) {
  if (this.isModified('isApproved') && this.isApproved && !this.approvedAt) {
    this.approvedAt = Date.now();
  }
  next();
});

// Static method to get average rating for a material
MaterialSchema.statics.getAverageRating = async function(materialId) {
  const obj = await this.aggregate([
    {
      $match: { _id: materialId }
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'material',
        as: 'reviews'
      }
    },
    {
      $addFields: {
        averageRating: { $avg: '$reviews.rating' },
        totalReviews: { $size: '$reviews' }
      }
    },
    {
      $project: {
        _id: 1,
        averageRating: { $ifNull: ['$averageRating', 0] },
        totalReviews: 1
      }
    }
  ]);

  try {
    await this.model('Material').findByIdAndUpdate(materialId, {
      rating: obj[0] ? obj[0].averageRating : 0,
      reviewCount: obj[0] ? obj[0].totalReviews : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save or delete of a review
MaterialSchema.post('save', function() {
  this.constructor.getAverageRating(this._id);
});

MaterialSchema.post('remove', function() {
  this.constructor.getAverageRating(this._id);
});

// Reverse populate with virtuals
MaterialSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'material',
  justOne: false
});

// Cascade delete reviews when a material is deleted
MaterialSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ material: this._id });
  await this.model('Notification').deleteMany({ referenceId: this._id });
  next();
});

// Index for text search
MaterialSchema.index({
  title: 'text',
  description: 'text',
  subject: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Material', MaterialSchema);
