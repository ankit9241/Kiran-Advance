const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const {
  submitFeedback,
  getTutorFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
  getFeedbackSummary,
  respondToFeedback,
  reportFeedback,
  getReportedFeedback,
  resolveFeedbackReport,
  getFeedbackByRating
} = require('../controllers/feedbackController');

// Public routes (if any)
// router.get('/public/:tutorId', getPublicTutorFeedback);

// Apply authentication middleware to all routes
router.use(protect);

// Student routes
router.route('/')
  .post(checkRole(['student']), submitFeedback)
  .get(checkRole(['student']), getMyFeedback);

// Get feedback for a specific tutor
router.get('/tutor/:tutorId', getTutorFeedback);

// Get feedback by rating
router.get('/rating/:rating', getFeedbackByRating);

// Update or delete own feedback
router.route('/:id')
  .put(checkRole(['student']), updateFeedback)
  .delete(checkRole(['student']), deleteFeedback);

// Respond to feedback (tutor only)
router.put('/:id/respond', checkRole(['tutor']), respondToFeedback);

// Report feedback
router.post('/:id/report', reportFeedback);

// Admin routes
router.use(authorize('admin'));

// Get feedback statistics
router.get('/stats', getFeedbackStats);

// Get feedback summary
router.get('/summary', getFeedbackSummary);

// Get reported feedback
router.get('/reported', getReportedFeedback);

// Resolve feedback report
router.put('/:id/resolve-report', resolveFeedbackReport);

module.exports = router;
