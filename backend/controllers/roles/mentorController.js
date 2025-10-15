const Mentor = require('../../models/Mentor');
const ErrorResponse = require('../../utils/errorResponse');

// @desc    Get mentor profile
// @route   GET /api/mentors/me
// @access  Private/Mentor
exports.getMentorProfile = async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.user.id);
    
    if (!mentor) {
      return next(new ErrorResponse('Mentor not found', 404));
    }

    res.status(200).json({
      success: true,
      data: mentor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update mentor profile
// @route   PUT /api/mentors/me
// @access  Private/Mentor
exports.updateMentorProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      bio: req.body.bio,
      expertise: req.body.expertise,
      education: req.body.education,
      experience: req.body.experience,
      availability: req.body.availability,
      hourlyRate: req.body.hourlyRate
    };

    const mentor = await Mentor.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: mentor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get mentor dashboard data
// @route   GET /api/mentors/dashboard
// @access  Private/Mentor
exports.getMentorDashboard = async (req, res, next) => {
  try {
    // This would typically fetch data like upcoming sessions, recent students, etc.
    // For now, we'll return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        upcomingSessions: [],
        recentStudents: [],
        earnings: {}
      }
    });
  } catch (err) {
    next(err);
  }
};
