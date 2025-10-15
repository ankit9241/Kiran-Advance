const jwt = require('jsonwebtoken');
const User = require('../models/base/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    console.log('Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully, user ID:', decoded.id);
    
    // Find user - try base User first, then specific role models
    let user = await User.findById(decoded.id);
    
    if (!user) {
      // Try finding in role-specific models
      const Student = require('../models/Student');
      const Mentor = require('../models/Mentor');
      const Admin = require('../models/Admin');
      
      if (decoded.role === 'student') {
        user = await Student.findById(decoded.id);
      } else if (decoded.role === 'mentor') {
        user = await Mentor.findById(decoded.id);
      } else if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id);
      }
    }
    
    if (!user) {
      console.error('User not found with ID:', decoded.id, 'and role:', decoded.role);
      return next(new ErrorResponse('User not found', 404));
    }
    
    console.log('User found:', { id: user._id, role: user.role });
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid token', 401));
    } else if (err.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expired', 401));
    }
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
