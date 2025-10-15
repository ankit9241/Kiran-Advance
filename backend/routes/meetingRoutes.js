const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const {
  scheduleMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  getMyMeetings,
  getTutorMeetings,
  getTutorAvailability,
  cancelMeeting,
  joinMeeting,
  endMeeting,
  getMeetingParticipants,
  sendMeetingReminders,
  rescheduleMeeting
} = require('../controllers/meetingController');

// Apply authentication middleware to all routes
router.use(protect);

// Get tutor availability
router.get('/availability/:tutorId', checkRole(['student', 'tutor', 'admin']), getTutorAvailability);

// Schedule a new meeting (tutor or admin only)
router.post('/', checkRole(['tutor', 'admin']), scheduleMeeting);

// Get all meetings (admin only)
router.get('/', authorize('admin'), getMeetings);

// Get current user's meetings
router.get('/my-meetings', getMyMeetings);

// Get tutor's meetings
router.get('/tutor/my-meetings', checkRole(['tutor']), getTutorMeetings);

// Meeting operations
router.route('/:id')
  .get(checkRole(['student', 'tutor', 'admin']), getMeeting)
  .put(checkRole(['tutor', 'admin']), updateMeeting)
  .delete(checkRole(['tutor', 'admin']), deleteMeeting);

// Reschedule meeting
router.put('/:id/reschedule', checkRole(['tutor', 'admin']), rescheduleMeeting);

// Cancel meeting
router.put('/:id/cancel', checkRole(['tutor', 'admin']), cancelMeeting);

// Join meeting
router.get('/:id/join', checkRole(['student', 'tutor', 'admin']), joinMeeting);

// End meeting (tutor or admin only)
router.put('/:id/end', checkRole(['tutor', 'admin']), endMeeting);

// Get meeting participants
router.get('/:id/participants', checkRole(['tutor', 'admin']), getMeetingParticipants);

// Send meeting reminders (admin only)
router.post('/:id/reminders', authorize('admin'), sendMeetingReminders);

module.exports = router;
