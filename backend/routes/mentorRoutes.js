const express = require('express');
const {
  getPendingMentors,
  approveMentor,
  rejectMentor,
  getApprovedMentors
} = require('../controllers/mentorController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getApprovedMentors);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.get('/pending', getPendingMentors);
router.put('/:id/approve', approveMentor);
router.put('/:id/reject', rejectMentor);

module.exports = router;
