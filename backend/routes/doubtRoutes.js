const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const {
  createDoubt,
  getDoubts,
  getDoubt,
  updateDoubt,
  deleteDoubt,
  addDoubtResponse,
  updateDoubtStatus,
  uploadDoubtAttachment,
  getMyDoubts,
  getTutorDoubts
} = require('../controllers/doubtController');

// Apply authentication middleware to all routes
router.use(protect);

// Student routes
router.route('/')
  .post(checkRole(['student']), createDoubt)
  .get(checkRole(['student', 'tutor', 'admin']), getDoubts);

// Get current user's doubts
router.get('/my-doubts', checkRole(['student']), getMyDoubts);

// Get tutor's assigned doubts
router.get('/tutor/my-doubts', checkRole(['tutor']), getTutorDoubts);

// Doubt responses
router.route('/:id/responses')
  .post(checkRole(['student', 'tutor', 'admin']), addDoubtResponse);

// Update doubt status (tutor/admin only)
router.put('/:id/status', checkRole(['tutor', 'admin']), updateDoubtStatus);

// Upload attachment
router.post('/:id/attachments', checkRole(['student', 'tutor', 'admin']), uploadDoubtAttachment);

// Single doubt operations
router.route('/:id')
  .get(checkRole(['student', 'tutor', 'admin']), getDoubt)
  .put(checkRole(['student', 'tutor', 'admin']), updateDoubt)
  .delete(checkRole(['student', 'admin']), deleteDoubt);

module.exports = router;
