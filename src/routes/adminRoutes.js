const express = require('express');
const router = express.Router();
const { adminLogin, getApplications, getProjects, patchApplicationStatus } = require('../controllers/adminController');
const { getAlumni, createAlumni, updateAlumni, deleteAlumni } = require('../controllers/alumniController');
const { updateHomepage } = require('../controllers/homepageController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const { adminLoginRules, patchStatusRules } = require('../validators/adminValidator');

router.post('/login', validate(adminLoginRules()), adminLogin);

router.get('/projects', protect, authorize('admin'), getProjects);
router.get('/applications', protect, authorize('admin'), getApplications);
router.patch('/applications/:id/status', protect, authorize('admin'), validate(patchStatusRules()), patchApplicationStatus);

// Alumni testimonials (admin)
router.get('/alumni', protect, authorize('admin'), getAlumni);
router.post('/alumni', protect, authorize('admin'), createAlumni);
router.put('/alumni/:id', protect, authorize('admin'), updateAlumni);
router.delete('/alumni/:id', protect, authorize('admin'), deleteAlumni);

// Homepage content (admin)
router.put('/homepage', protect, authorize('admin'), updateHomepage);

module.exports = router;
