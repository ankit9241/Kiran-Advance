const ErrorResponse = require('../utils/errorResponse');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const Notification = require('../models/Notification');

// @desc    Get all pending mentor requests
// @route   GET /api/admins/mentor-requests
// @access  Private/Admin
exports.getMentorRequests = async (req, res, next) => {
  try {
    const mentors = await Mentor.find({ isApproved: false })
      .select('name email bio expertise createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve/Reject mentor request
// @route   PUT /api/admins/mentor-requests/:id
// @access  Private/Admin
exports.handleMentorRequest = async (req, res, next) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    
    if (!['approve', 'reject'].includes(action)) {
      return next(new ErrorResponse('Invalid action. Must be "approve" or "reject"', 400));
    }

    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return next(new ErrorResponse('Mentor not found', 404));
    }

    if (action === 'approve') {
      mentor.isApproved = true;
      await mentor.save();
      
      // Create notification for the mentor
      await Notification.create({
        user: mentor._id,
        type: 'mentor_approved',
        message: 'Your mentor account has been approved!',
        data: { role: 'mentor' }
      });
      
      return res.status(200).json({
        success: true,
        message: 'Mentor approved successfully',
        data: mentor
      });
    } else {
      // Reject mentor
      await Notification.create({
        user: mentor._id,
        type: 'mentor_rejected',
        message: 'Your mentor application has been rejected.',
        data: { role: 'mentor' }
      });
      
      // Optionally delete the mentor or keep with rejected status
      await mentor.remove();
      
      return res.status(200).json({
        success: true,
        message: 'Mentor rejected and removed',
        data: {}
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get all recent student registrations
// @route   GET /api/admins/student-registrations
// @access  Private/Admin
exports.getStudentRegistrations = async (req, res, next) => {
  try {
    // Get registrations from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const students = await Student.find({
      createdAt: { $gte: oneWeekAgo }
    })
      .select('name email grade school createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all notifications for admin
// @route   GET /api/admins/notifications
// @access  Private/Admin
exports.getAdminNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      read: false
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (err) {
    next(err);
  }
};
