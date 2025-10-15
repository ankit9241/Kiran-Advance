const ErrorResponse = require('../utils/errorResponse');
const Mentor = require('../models/Mentor');

// @desc    Middleware to check if mentor is approved
// @access  Private
exports.requireMentorApproval = async (req, res, next) => {
  try {
    // Skip if user is not a mentor
    if (req.user.role !== 'mentor') {
      return next();
    }

    // Get mentor from database
    const mentor = await Mentor.findById(req.user.id);

    // If mentor not found or not approved
    if (!mentor || !mentor.isApproved) {
      return next(new ErrorResponse('Your mentor account is pending approval', 403));
    }

    next();
  } catch (err) {
    next(err);
  }
};

// @desc    Middleware to handle mentor approval status in response
//          Adds isApproved flag to response for frontend use
exports.addApprovalStatus = (req, res, next) => {
  // Only process if this is a successful response
  const originalJson = res.json;
  
  res.json = function(data) {
    // Only add isApproved if user is a mentor
    if (req.user && req.user.role === 'mentor') {
      if (typeof data === 'object' && data !== null) {
        data.isApproved = req.user.isApproved || false;
      }
    }
    originalJson.call(this, data);
  };
  
  next();
};
