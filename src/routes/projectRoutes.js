const express = require('express');
const router = express.Router();
const {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getOpenProjects,
  getProjectById,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const {
  createProjectRules,
  updateProjectRules,
  projectIdParam,
} = require('../validators/projectValidator');

router.get('/', getOpenProjects);
router.get('/:id', validate(projectIdParam()), getProjectById);

router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createProjectRules()),
  createProject
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(updateProjectRules()),
  updateProject
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validate(projectIdParam()),
  deleteProject
);

module.exports = router;
