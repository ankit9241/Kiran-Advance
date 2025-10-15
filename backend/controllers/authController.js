const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const Admin = require('../models/Admin');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log('Registration request received:', {
      body: req.body,
      files: req.files,
      headers: req.headers
    });

    const { name, email, password, role, phone, bio, subjects, specializations, experience, education, achievements, teachingStyle, address, linkedin, website, telegramId, whatsapp, timezone, schedule, currentStatus, languages } = req.body;
    
    // Check for required fields with detailed error messages
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!role) missingFields.push('role');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if user exists
    let user = await Student.findOne({ email }) || 
               await Mentor.findOne({ email }) || 
               await Admin.findOne({ email });
               
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user based on role
    let newUser;
    const normalizedRole = role.toLowerCase();
    
    // Handle file uploads if any
    let profileImage = '';
    if (req.files?.profileImage) {
      const profileImageFile = req.files.profileImage;
      const uploadPath = path.join(__dirname, '../public/uploads/profile-pictures');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(profileImageFile.name);
      const filename = `profile-${uniqueSuffix}${ext}`;
      const filepath = path.join(uploadPath, filename);
      
      // Move the file to the uploads directory
      await profileImageFile.mv(filepath);
      profileImage = `/uploads/profile-pictures/${filename}`;
    }
    
    // Similarly handle CV upload if needed
    let cv = '';
    let certificates = [];
    
    if (req.files?.certificates) {
      certificates = req.files.certificates.map(file => file.filename);
    }
    
    // Base user data
    const userData = { 
      name, 
      email,
      password: await bcrypt.hash(password, 10),
      profileImage,
      phone: phone || '',
      bio: bio || '',
      address: address ? (typeof address === 'string' ? JSON.parse(address) : address) : {},
      linkedin: linkedin || '',
      website: website || '',
      telegramId: telegramId || '',
      whatsapp: whatsapp || '',
      timezone: timezone || 'UTC',
      currentStatus: currentStatus || 'active',
      languages: languages || []
    };

    // Handle role-specific data
    if (normalizedRole === 'mentor') {
      // Parse JSON strings if they were sent as strings
      const educationArray = typeof education === 'string' ? JSON.parse(education) : education || [];
      const specializationsArray = typeof specializations === 'string' ? JSON.parse(specializations) : specializations || [];
      const subjectsArray = typeof subjects === 'string' ? JSON.parse(subjects) : subjects || [];
      const achievementsArray = typeof achievements === 'string' ? JSON.parse(achievements) : achievements || [];
      const languagesArray = typeof languages === 'string' ? JSON.parse(languages) : languages || ['English'];
      
      // Create mentor with all fields
      newUser = await Mentor.create({
        ...userData,
        bio: bio || '',
        subjects: subjectsArray,
        specializations: specializationsArray,
        education: educationArray,
        achievements: achievementsArray,
        teachingStyle: teachingStyle || '',
        address: address || '',
        linkedin: linkedin || '',
        website: website || '',
        telegramId: telegramId || '',
        whatsapp: whatsapp || '',
        cv: cv || '',
        certificates: certificates,
        timezone: timezone || 'UTC',
        schedule: schedule || 'Mon-Fri: 9 AM - 6 PM',
        currentStatus: currentStatus || 'Available for mentoring',
        languages: languagesArray,
        isApproved: false, // New mentors need admin approval
        hourlyRate: 0, // Default value, can be updated later
        rating: 5 // Default rating
      });
      
      console.log('Mentor created:', newUser);
      
    } else if (normalizedRole === 'student') {
      // Handle student registration
      const { 
        dateOfBirth, 
        gender, 
        stream, 
        studentClass, 
        bio = '', 
        preferredSubjects = [], 
        learningGoals = '', 
        targetExam = '',
        targetExams = [],
        hobbies = [],
        address = {},
        schoolCollegeName = '',
        board = ''
      } = req.body;

      console.log('Creating student with data:', {
        name,
        email,
        dateOfBirth,
        gender,
        stream,
        studentClass,
        schoolCollegeName,
        board,
        preferredSubjects,
        address
      });

      // Create student with all required fields
      newUser = await Student.create({
        ...userData,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
        gender: gender || 'prefer-not-to-say',
        stream: stream || 'General',
        studentClass: studentClass || 'General',
        schoolCollegeName: schoolCollegeName,
        board: board,
        bio,
        preferredSubjects: Array.isArray(preferredSubjects) ? preferredSubjects : (preferredSubjects ? [preferredSubjects] : []),
        learningGoals,
        targetExam,
        targetExams: Array.isArray(targetExams) ? targetExams : (targetExams ? [targetExams] : []),
        hobbies: Array.isArray(hobbies) ? hobbies : (hobbies ? [hobbies] : []),
        address: {
          street: address?.street || '',
          city: address?.city || '',
          state: address?.state || '',
          country: address?.country || '',
          pincode: address?.pincode || ''
        },
        isProfileComplete: false,
        isApproved: true
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }
    
    // Generate token
    const token = newUser.getSignedJwtToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: normalizedRole,
        isApproved: newUser.isApproved !== undefined ? newUser.isApproved : true
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate field value entered',
        field: Object.keys(error.keyPattern)[0]
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    console.log('Login attempt for email:', req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password'
      });
    }

    // Check if user exists in any role
    let user;
    try {
      console.log('Attempting to find user with email:', email);
      
      // First check the users collection (where admin users are stored)
      user = await mongoose.connection.db.collection('users').findOne({
        email: email.trim().toLowerCase()
      });
      
      if (user) {
        console.log('User found in users collection with role:', user.role);
      } else {
        // If not found in users collection, check other collections
        const [student, mentor] = await Promise.all([
          Student.findOne({ email: email.trim().toLowerCase() }).select('+password'),
          Mentor.findOne({ email: email.trim().toLowerCase() }).select('+password')
        ]);
        
        console.log('Student search result:', student ? 'Found' : 'Not found');
        console.log('Mentor search result:', mentor ? 'Found' : 'Not found');
        
        user = student || mentor;
      }
      
      if (!user) {
        console.log('No user found with email:', email);
        return res.status(401).json({
          success: false,
          error: 'No account found with this email address'
        });
      }
      
      console.log('User found with role:', user.role);
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Database error during login',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    // User existence check moved earlier in the flow

    // Check if password matches
    let isMatch;
    try {
      console.log('Comparing passwords...');
      
      // If user is from users collection (raw MongoDB document)
      if (user.password) {
        isMatch = await bcrypt.compare(password, user.password);
      } 
      // If user is a Mongoose model instance (from Student or Mentor models)
      else if (typeof user.matchPassword === 'function') {
        isMatch = await user.matchPassword(password);
      } else {
        throw new Error('Invalid user object - missing password comparison method');
      }
      
      console.log('Password match result:', isMatch ? 'Match' : 'No match');
      
      if (!isMatch) {
        console.log('Incorrect password for user:', email);
        return res.status(401).json({
          success: false,
          error: 'Incorrect password. Please try again.'
        });
      }
    } catch (pwdError) {
      console.error('Password comparison error:', pwdError);
      return res.status(500).json({
        success: false,
        error: 'Error during authentication',
        details: process.env.NODE_ENV === 'development' ? pwdError.message : undefined
      });
    }

    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // For mentors, check if they are approved
    if (user.role === 'mentor' && !user.isApproved) {
      console.log('Mentor not approved:', email);
      return res.status(403).json({
        success: false,
        error: 'Your mentor account is pending approval'
      });
    }

    try {
      // Update last login
      const updateData = { lastLogin: Date.now() };
      
      // If user is a raw document from users collection
      if (user.collection) {
        await user.collection.updateOne(
          { _id: user._id },
          { $set: updateData }
        );
        // Update the local user object
        user.lastLogin = updateData.lastLogin;
      } 
      // If user is a Mongoose model
      else if (typeof user.save === 'function') {
        user.lastLogin = updateData.lastLogin;
        await user.save();
      }

      // Generate token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
      
      console.log('Login successful for user:', user.email, 'Role:', user.role);

      // Prepare user data for response
      const profileImageUrl = user.profileImage || user.profilePicture || 'default.jpg';
      
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved !== undefined ? user.isApproved : true,
        profilePicture: profileImageUrl,
        profileImage: profileImageUrl, // Add both for compatibility
        avatar: profileImageUrl, // Frontend uses this field
        phone: user.phone || '',
        studentId: user.studentId || '',
        stream: user.stream || '',
        studentClass: user.studentClass || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || 'prefer-not-to-say',
        bloodGroup: user.bloodGroup || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          pincode: ''
        },
        bio: user.bio || '',
        preferredSubjects: user.preferredSubjects || [],
        learningGoals: user.learningGoals || '',
        targetExam: user.targetExam || '',
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        // Include all other student fields
        ...(user.role === 'student' || user.role === 'Student' ? {
          emergencyContact: user.emergencyContact || {
            name: '',
            relation: '',
            phone: ''
          }
        } : {})
      };

      return res.status(200).json({
        success: true,
        token,
        role: user.role,
        isApproved: user.isApproved !== undefined ? user.isApproved : true,
        data: userData
      });
    } catch (saveError) {
      console.error('Error during login save/token generation:', saveError);
      return res.status(500).json({
        success: false,
        error: 'Error completing login',
        details: process.env.NODE_ENV === 'development' ? saveError.message : undefined
      });
    }
  } catch (err) {
    console.error('Unexpected error in login controller:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during login',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Helper function to send admin notifications
const sendAdminNotification = async (notificationData) => {
  try {
    const Notification = require('../models/Notification');
    const admins = await Admin.find({});
    
    const notifications = admins.map(admin => ({
      user: admin._id,
      type: notificationData.type,
      message: notificationData.message,
      data: {
        userId: notificationData.userId,
        role: notificationData.role
      }
    }));
    
    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    console.log('🔍 getMe called for user:', { id: req.user.id, role: req.user.role });
    
    // Use the user from auth middleware or try to find the specific role model
    let user = req.user;
    
    // If the user from middleware doesn't have all the fields we need,
    // try to get the full user object from the appropriate model
    if (!user.studentId && user.role && user.role.toLowerCase() === 'student') {
      try {
        const fullUser = await Student.findById(req.user.id);
        if (fullUser) {
          user = fullUser;
        }
      } catch (error) {
        console.log('Could not find full student data, using middleware user');
      }
    }
    
    if (!user) {
      console.error('❌ No user data available');
      return next(new ErrorResponse('User not found', 404));
    }
    
    console.log('✅ User data found:', { id: user._id || user.id, role: user.role, name: user.name });

    // Convert Mongoose document to plain object
    const userObject = user.toObject ? user.toObject() : user;
    
    // Prepare response data with all necessary fields
    const profileImageUrl = userObject.profileImage || userObject.profilePicture || 'default.jpg';
    
    const responseData = {
      id: userObject._id,
      name: userObject.name,
      email: userObject.email,
      role: userObject.role,
      isApproved: userObject.isApproved !== undefined ? userObject.isApproved : true,
      profilePicture: profileImageUrl,
      profileImage: profileImageUrl, // Add both for compatibility
      avatar: profileImageUrl, // Frontend uses this field
      phone: userObject.phone || '',
      studentId: userObject.studentId || '',
      stream: userObject.stream || '',
      studentClass: userObject.studentClass || '',
      dateOfBirth: userObject.dateOfBirth || '',
      gender: userObject.gender || 'prefer-not-to-say',
      bloodGroup: userObject.bloodGroup || '',
      address: userObject.address || {
        street: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
      },
      bio: userObject.bio || '',
      preferredSubjects: userObject.preferredSubjects || [],
      learningGoals: userObject.learningGoals || '',
      targetExam: userObject.targetExam || '',
      lastLogin: userObject.lastLogin,
      createdAt: userObject.createdAt
    };

    // Add role-specific fields
    if (userObject.role === 'student' || userObject.role === 'Student') {
      responseData.emergencyContact = userObject.emergencyContact || {
        name: '',
        relation: '',
        phone: ''
      };
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    console.log('🔍 Update details request received', {
      userId: req.user?.id,
      role: req.user?.role,
      body: { ...req.body, profileImage: req.body.profileImage ? '[EXISTS]' : 'none' },
      files: req.files ? Object.keys(req.files) : 'No files',
      headers: {
        authorization: req.headers.authorization ? 'Bearer [TOKEN]' : 'No token',
        'content-type': req.headers['content-type']
      }
    });

    if (!req.user || !req.user.id) {
      console.error('❌ No user in request object. Auth middleware might not be working correctly.');
      return next(new ErrorResponse('User not authenticated', 401));
    }

    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      studentId: req.body.studentId,
      stream: req.body.stream,
      studentClass: req.body.studentClass,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      bloodGroup: req.body.bloodGroup,
      bio: req.body.bio,
      learningGoals: req.body.learningGoals,
      targetExam: req.body.targetExam
    };

    console.log('📝 Fields to update (before processing):', Object.keys(fieldsToUpdate).filter(k => fieldsToUpdate[k] !== undefined));

    // Handle address if provided
    if (req.body.address) {
      try {
        const address = typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address;
        fieldsToUpdate.address = address;
      } catch (e) {
        console.error('Error parsing address:', e);
      }
    }

    // Handle emergency contact if provided
    if (req.body.emergencyContact) {
      try {
        const emergencyContact = typeof req.body.emergencyContact === 'string' 
          ? JSON.parse(req.body.emergencyContact) 
          : req.body.emergencyContact;
        fieldsToUpdate.emergencyContact = emergencyContact;
      } catch (e) {
        console.error('Error parsing emergency contact:', e);
      }
    }

    // Handle preferred subjects if provided
    if (req.body.preferredSubjects) {
      try {
        const preferredSubjects = typeof req.body.preferredSubjects === 'string'
          ? req.body.preferredSubjects.split(',').map(s => s.trim())
          : req.body.preferredSubjects;
        fieldsToUpdate.preferredSubjects = preferredSubjects;
      } catch (e) {
        console.error('Error parsing preferred subjects:', e);
      }
    }

    // Handle file upload if present
    if (req.files && (req.files.profileImage || req.files.profilePicture)) {
      try {
        const file = req.files.profileImage ? req.files.profileImage : req.files.profilePicture;
        const fileToUpload = Array.isArray(file) ? file[0] : file;
        
        // Ensure file has a valid name and extension
        const fileExt = path.extname(fileToUpload.name).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
          throw new Error('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.');
        }
        
        const fileName = `profile-${req.user.id}-${Date.now()}${fileExt}`;
        const uploadDir = path.join(__dirname, '../uploads');
        const uploadPath = path.join(uploadDir, fileName);
        
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
          console.log(`Created uploads directory at: ${uploadDir}`);
        }
        
        // Move the file to the uploads directory
        await fileToUpload.mv(uploadPath);
        console.log(`File uploaded successfully: ${fileName}`);
        
        // Update the profile image path
        fieldsToUpdate.profileImage = fileName;
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return next(new ErrorResponse(`Error uploading profile picture: ${error.message}`, 400));
      }
    } else if (req.body.profileImage || req.body.profilePicture) {
      // If no new file but profile image is in the request body
      const profileImage = req.body.profileImage || req.body.profilePicture;
      if (profileImage && profileImage !== 'default.jpg') {
        // Remove any existing path and just keep the filename
        fieldsToUpdate.profileImage = path.basename(profileImage);
      }
    }

    let user;
    const options = { new: true, runValidators: true };
    const userId = req.user.id;
    const userRole = req.user.role;
    
    console.log(`🔎 Looking up user to update:`, {
      userId,
      userRole,
      model: userRole.charAt(0).toUpperCase() + userRole.slice(1)
    });
    
    try {
      // First, verify the user exists in the database using the base User model
      const User = require('../models/base/User');
      const existingUser = await User.findById(userId);
      
      if (!existingUser) {
        console.error(`❌ User not found in database. ID: ${userId}`);
        return next(new ErrorResponse('User not found in database', 404));
      }
      
      console.log(`✅ Found existing user:`, {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role
      });
      
      // Now perform the update using the appropriate model based on role
      console.log(`🔄 Updating user with data:`, fieldsToUpdate);
      
      // First, update the base user fields
      await User.findByIdAndUpdate(userId, {
        name: fieldsToUpdate.name,
        email: fieldsToUpdate.email,
        phone: fieldsToUpdate.phone,
        profileImage: fieldsToUpdate.profileImage
      }, options);
      
      // Then update the role-specific fields using the appropriate model
      let roleModel;
      switch(userRole) {
        case 'student':
          roleModel = require('../models/Student');
          break;
        case 'mentor':
          roleModel = require('../models/Mentor');
          break;
        case 'admin':
          roleModel = require('../models/Admin');
          break;
        default:
          console.error(`❌ Invalid user role: ${userRole}`);
          return next(new ErrorResponse('Invalid user role', 400));
      }
      
      // Remove fields that were already updated in the base model
      const roleSpecificFields = { ...fieldsToUpdate };
      delete roleSpecificFields.name;
      delete roleSpecificFields.email;
      delete roleSpecificFields.phone;
      delete roleSpecificFields.profileImage;
      
      // Only update if there are role-specific fields to update
      if (Object.keys(roleSpecificFields).length > 0) {
        await roleModel.findByIdAndUpdate(userId, roleSpecificFields, options);
      }
      
      // Get the updated user with all fields populated
      user = await roleModel.findById(userId);

      if (!user) {
        console.error(`❌ User not found in database. ID: ${userId}, Role: ${req.user.role}`);
        return next(new ErrorResponse('User not found in database', 404));
      }
      
      console.log('✅ User updated successfully:', {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || 'Not set'
      });
    } catch (error) {
      console.error('❌ Error updating user:', {
        error: error.message,
        stack: error.stack,
        userId,
        role: req.user.role
      });
      return next(new ErrorResponse(`Error updating user: ${error.message}`, 500));
    }

    // Prepare response data with full URL for the profile image
    const baseUrl = req.protocol + '://' + req.get('host');
    const userProfileImage = user.profileImage || user.profilePicture || 'default.jpg';
    const profileImageUrl = userProfileImage && userProfileImage !== 'default.jpg' && !userProfileImage.startsWith('http') 
      ? `${baseUrl}/uploads/${userProfileImage}`
      : userProfileImage;
      
    const responseData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: profileImageUrl,
      profilePicture: profileImageUrl, // For backward compatibility
      avatar: profileImageUrl, // Frontend uses this field
      phone: user.phone || '',
      studentId: user.studentId || '',
      stream: user.stream || '',
      studentClass: user.studentClass || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || 'prefer-not-to-say',
      bloodGroup: user.bloodGroup || '',
      address: user.address || { street: '', city: '', state: '', country: '', pincode: '' },
      bio: user.bio || '',
      preferredSubjects: user.preferredSubjects || [],
      learningGoals: user.learningGoals || '',
      targetExam: user.targetExam || '',
      emergencyContact: user.emergencyContact || { name: '', relation: '', phone: '' }
    };

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (err) {
    console.error('Error in updateDetails:', err);
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    // Get user based on role
    let user;
    switch(req.user.role) {
      case 'student':
        user = await Student.findById(req.user.id).select('+password');
        break;
      case 'mentor':
        user = await Mentor.findById(req.user.id).select('+password');
        break;
      case 'admin':
        user = await Admin.findById(req.user.id).select('+password');
        break;
    }

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    // Generate new token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
