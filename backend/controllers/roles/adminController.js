const Admin = require('../../models/Admin');
const Student = require('../../models/Student');
const Mentor = require('../../models/Mentor');
const ErrorResponse = require('../../utils/errorResponse');

// @desc    Get admin profile
// @route   GET /api/admins/me
// @access  Private/Admin
exports.getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      return next(new ErrorResponse('Admin not found', 404));
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update admin profile
// @route   PUT /api/admins/me
// @access  Private/Admin
exports.updateAdminProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      department: req.body.department,
      permissions: req.body.permissions,
      canImpersonate: req.body.canImpersonate
    };

    const admin = await Admin.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/admins/dashboard
// @access  Private/Admin
exports.getAdminDashboard = async (req, res, next) => {
  try {
    // Get counts of users
    const studentCount = await Student.countDocuments();
    const mentorCount = await Mentor.countDocuments();
    const adminCount = await Admin.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        userCounts: {
          students: studentCount,
          mentors: mentorCount,
          admins: adminCount
        },
        recentActivity: []
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admins/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const students = await Student.find().select('-password');
    const mentors = await Mentor.find().select('-password');
    const admins = await Admin.find().select('-password');

    res.status(200).json({
      success: true,
      count: students.length + mentors.length + admins.length,
      data: {
        students,
        mentors,
        admins
      }
    });
  } catch (err) {
    next(err);
  }
};
