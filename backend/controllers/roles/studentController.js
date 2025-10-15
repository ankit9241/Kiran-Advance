const Student = require('../../models/Student');
const ErrorResponse = require('../../utils/errorResponse');
const { uploadFile, deleteFile } = require('../../utils/fileUpload');
const asyncHandler = require('../../middleware/async');

// @desc    Get student profile
// @route   GET /api/students/me
// @access  Private/Student
exports.getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    
    if (!student) {
      return next(new ErrorResponse('Student not found', 404));
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update student profile
// @route   PUT /api/students/me
// @access  Private/Student
exports.updateStudentProfile = asyncHandler(async (req, res, next) => {
  console.log('Update profile request received:', {
    userId: req.user.id,
    body: req.body,
    files: req.files ? Object.keys(req.files) : 'No files'
  });
  
  try {
    let student = await Student.findById(req.user.id);
    
    if (!student) {
      console.error('Student not found with ID:', req.user.id);
      return next(new ErrorResponse('Student not found', 404));
    }

    // Handle file upload if present
    let profilePictureUrl = student.profilePicture;
    if (req.files && req.files.profilePicture) {
      try {
        console.log('Processing profile picture upload...');
        // Delete old profile picture if it exists and is not the default
        if (student.profilePicture && !student.profilePicture.includes('default.jpg')) {
          console.log('Deleting old profile picture:', student.profilePicture);
          await deleteFile(student.profilePicture);
        }
        
        // Upload new profile picture
        const file = req.files.profilePicture;
        console.log('Uploading new profile picture:', file.name);
        profilePictureUrl = await uploadFile(file, req.user.id);
        console.log('Profile picture uploaded successfully:', profilePictureUrl);
      } catch (fileError) {
        console.error('Error processing profile picture:', fileError);
        return next(new ErrorResponse('Error processing profile picture', 500));
      }
    }

    // Handle preferred subjects (convert string to array if needed)
    let preferredSubjects = req.body.preferredSubjects;
    if (preferredSubjects && typeof preferredSubjects === 'string') {
      preferredSubjects = preferredSubjects.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Prepare update data
    const updateData = {
      name: req.body.name || student.name,
      email: req.body.email || student.email,
      phone: req.body.phone || student.phone,
      stream: req.body.stream || student.stream,
      class: req.body.studentClass || student.class,
      dateOfBirth: req.body.dateOfBirth || student.dateOfBirth,
      gender: req.body.gender || student.gender,
      bloodGroup: req.body.bloodGroup || student.bloodGroup,
      bio: req.body.bio || student.bio,
      preferredSubjects: preferredSubjects || student.preferredSubjects || [],
      learningGoals: req.body.learningGoals || student.learningGoals || [],
      targetExam: req.body.targetExam || student.targetExam,
      profilePicture: profilePictureUrl
    };

    // Handle address update if provided
    if (req.body.address) {
      updateData.address = {
        ...(student.address || {}),
        ...(typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address)
      };
    }

    // Handle emergency contact update if provided
    if (req.body.emergencyContact) {
      updateData.emergencyContact = {
        ...(student.emergencyContact || {}),
        ...(typeof req.body.emergencyContact === 'string' 
          ? JSON.parse(req.body.emergencyContact) 
          : req.body.emergencyContact)
      };
    }
    
    console.log('Updating student with data:', JSON.stringify(updateData, null, 2));
    
    // Apply updates to student document
    Object.assign(student, updateData);
    
    // Save the updated student
    console.log('Attempting to save student updates...');
    try {
      const updatedStudent = await student.save();
      
      console.log('Student updated successfully:', updatedStudent._id);
      
      res.status(200).json({
        success: true,
        data: updatedStudent
      });
    } catch (saveError) {
      console.error('Error saving student updates:', {
        message: saveError.message,
        name: saveError.name,
        code: saveError.code,
        keyPattern: saveError.keyPattern,
        keyValue: saveError.keyValue,
        errors: saveError.errors
      });
      
      // Handle validation errors specifically
      if (saveError.name === 'ValidationError') {
        const messages = Object.values(saveError.errors).map(val => val.message);
        return next(new ErrorResponse(messages, 400));
      }
      
      // Handle duplicate key errors
      if (saveError.code === 11000) {
        return next(new ErrorResponse('Duplicate field value entered', 400));
      }
      
      next(new ErrorResponse(`Failed to update student profile: ${saveError.message}`, 500));
    }
  } catch (error) {
    console.error('Unexpected error in updateStudentProfile:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    next(new ErrorResponse(`Server error: ${error.message}`, 500));
  }
});

// @desc    Get student dashboard data
// @route   GET /api/students/dashboard
// @access  Private/Student
exports.getStudentDashboard = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id)
      .select('-password')
      .populate('enrolledCourses');

    if (!student) {
      return next(new ErrorResponse('Student not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        ...student.toObject(),
        recentDoubts: [],
        learningProgress: {}
      }
    });
  } catch (err) {
    next(err);
  }
};
