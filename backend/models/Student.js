const mongoose = require('mongoose');
const User = require('./base/User');
const path = require('path');

// Student Schema that extends the base User
const StudentSchema = new mongoose.Schema({
  // Auto-generated student registration ID (e.g., STU2025001)
  studentId: {
    type: String,
    unique: true,
    required: true,
    index: true,
    immutable: true,
    default: function() {
      // Generate a simple ID with current year and random number
      const year = new Date().getFullYear().toString().slice(-2);
      const random = Math.floor(1000 + Math.random() * 9000);
      return `STU${year}${random}`;
    }
  },
  stream: {
    type: String,
    required: [true, 'Please add a department/stream']
  },
  studentClass: {
    type: String,
    required: [true, 'Please add a class/year']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add date of birth']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      trim: true,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      trim: true,
      required: [true, 'Country is required']
    },
    pincode: {
      type: String,
      trim: true,
      required: [true, 'Pincode is required']
    }
  },
  // Education fields
  schoolCollegeName: {
    type: String,
    trim: true,
    required: [true, 'School/College name is required']
  },
  board: {
    type: String,
    required: [true, 'Board is required'],
    enum: ['CBSE', 'ICSE', 'State Board', 'IGCSE', 'IB', 'Other']
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  preferredSubjects: [{
    type: String,
    trim: true
  }],
  learningGoals: {
    type: String,
    maxlength: [1000, 'Learning goals cannot be more than 1000 characters']
  },
  targetExam: String,
  targetExams: [{
    type: String,
    trim: true
  }],
  hobbies: [{
    type: String,
    trim: true
  }],
  profilePicture: {
    type: String,
    default: 'default.jpg'
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  // Emergency contact for students
  emergencyContact: {
    name: {
      type: String,
      trim: true,
      default: ''
    },
    relation: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    }
  }
});

// Set the role to 'student' by default and check profile completion
StudentSchema.pre('save', function(next) {
  this.role = 'student';
  
  // Check if required profile fields are filled
  if (
    this.name &&
    this.email &&
    this.stream &&
    this.studentClass && 
    this.dateOfBirth &&
    this.address?.city &&
    this.address?.state &&
    this.address?.country &&
    this.address?.pincode &&
    this.schoolCollegeName &&
    this.board &&
    this.preferredSubjects?.length > 0
  ) {
    this.isProfileComplete = true;
  }
  
  next();
});

// Static method to update student profile
StudentSchema.statics.updateProfile = async function(userId, profileData, file) {
  let updateData = { ...profileData };
  
  // Handle file upload if present
  if (file) {
    const fileName = `student-${userId}-${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join('uploads', 'profile-pictures', fileName);
    
    // In a real app, you would upload to cloud storage here
    // For now, we'll just store the file name
    updateData.profilePicture = `/uploads/profile-pictures/${fileName}`;
  }
  
  // Convert string of preferred subjects to array if needed
  if (updateData.preferredSubjects && typeof updateData.preferredSubjects === 'string') {
    updateData.preferredSubjects = updateData.preferredSubjects
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
  
  // Update the student profile
  const student = await this.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  
  return student;
};


// Create text index for search functionality
StudentSchema.index({ studentId: 'text', name: 'text', email: 'text' });

// Add static method to find by studentId
StudentSchema.statics.findByStudentId = function(studentId) {
  return this.findOne({ studentId });
};

module.exports = User.discriminator('Student', StudentSchema);
