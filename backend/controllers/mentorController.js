const Mentor = require('../models/Mentor');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all pending mentor applications
// @route   GET /api/v1/mentors/pending
// @access  Private/Admin
exports.getPendingMentors = asyncHandler(async (req, res, next) => {
  const mentors = await Mentor.find({ isApproved: false })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: mentors.length,
    data: mentors
  });
});

// @desc    Approve a mentor
// @route   PUT /api/v1/mentors/:id/approve
// @access  Private/Admin
exports.approveMentor = asyncHandler(async (req, res, next) => {
  const mentor = await Mentor.findById(req.params.id);

  if (!mentor) {
    return next(new ErrorResponse(`Mentor not found with id of ${req.params.id}`, 404));
  }

  // Update mentor status
  mentor.isApproved = true;
  mentor.approvedAt = Date.now();
  mentor.approvedBy = req.user.id;
  
  await mentor.save();

  // Create notification for the mentor
  await Notification.create({
    user: mentor._id,
    title: 'Mentor Application Approved',
    message: 'Congratulations! Your mentor application has been approved. You can now access all mentor features.',
    type: 'account_activity',
    isRead: false
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Reject a mentor application
// @route   PUT /api/v1/mentors/:id/reject
// @access  Private/Admin
exports.rejectMentor = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    return next(new ErrorResponse('Please provide a reason for rejection', 400));
  }

  const mentor = await Mentor.findById(req.params.id);

  if (!mentor) {
    return next(new ErrorResponse(`Mentor not found with id of ${req.params.id}`, 404));
  }

  // Create notification for the mentor
  await Notification.create({
    user: mentor._id,
    title: 'Mentor Application Rejected',
    message: `Your mentor application has been rejected. Reason: ${reason}`,
    type: 'account_activity',
    isRead: false
  });

  // Delete the mentor application
  await mentor.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get all approved mentors
// @route   GET /api/v1/mentors
// @access  Public
exports.getApprovedMentors = asyncHandler(async (req, res, next) => {
  const mentors = await Mentor.find({ isApproved: true })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: mentors.length,
    data: mentors
  });
});
