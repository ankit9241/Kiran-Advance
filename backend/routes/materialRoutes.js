const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const {
  uploadMaterial,
  getMaterials,
  getMaterial,
  updateMaterial,
  deleteMaterial,
  downloadMaterial,
  getMaterialsBySubject,
  searchMaterials,
  getFeaturedMaterials,
  getMaterialCategories,
  uploadMaterialAttachment,
  approveMaterial,
  getPendingMaterials
} = require('../controllers/materialController');

// Public routes
router.get('/categories', getMaterialCategories);
router.get('/featured', getFeaturedMaterials);
router.get('/subject/:subject', getMaterialsBySubject);
router.get('/search', searchMaterials);

// Apply authentication middleware to all other routes
router.use(protect);

// Get all materials (authenticated users)
router.get('/', getMaterials);

// Get single material (authenticated users)
router.get('/:id', getMaterial);

// Download material (authenticated users with appropriate access)
router.get('/:id/download', downloadMaterial);

// Tutor and Admin routes
router.use(checkRole(['tutor', 'admin']));

// Upload new material
router.post('/', uploadMaterial);

// Upload attachment for material
router.post('/:id/attachments', uploadMaterialAttachment);

// Admin only routes
router.use(authorize('admin'));

// Approve pending material
router.put('/:id/approve', approveMaterial);

// Get pending materials for approval
router.get('/pending', getPendingMaterials);

// Update and delete material (admin only)
router.route('/:id')
  .put(updateMaterial)
  .delete(deleteMaterial);

module.exports = router;
