const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const studentController = require('../../controllers/roles/studentController');

const { protect, authorize } = auth;

// All routes are protected and require student role
router.use(protect);
router.use(authorize('student'));

// Student profile routes
router.route('/me')
  .get((req, res, next) => {
    console.log('GET /me route hit');
    next();
  }, studentController.getStudentProfile)
  .put((req, res, next) => {
    console.log('PUT /me route hit');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    next();
  }, studentController.updateStudentProfile);

// Dashboard route
router.get('/dashboard', studentController.getStudentDashboard);

module.exports = router;
