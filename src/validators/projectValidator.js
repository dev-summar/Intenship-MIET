const { body, param } = require('express-validator');

const createProjectRules = () => [
  body('projectCode')
    .trim()
    .notEmpty()
    .withMessage('Project code is required')
    .isLength({ max: 20 })
    .withMessage('Project code cannot exceed 20 characters')
    .toUpperCase(),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('domain')
    .trim()
    .notEmpty()
    .withMessage('Domain is required')
    .isLength({ max: 100 })
    .withMessage('Domain cannot exceed 100 characters'),
  body('requiredSkills')
    .optional()
    .isArray()
    .withMessage('Required skills must be an array'),
  body('requiredSkills.*').optional().trim().isString(),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Duration is required')
    .isLength({ max: 50 })
    .withMessage('Duration cannot exceed 50 characters'),
  body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be open or closed'),
];

const updateProjectRules = () => [
  param('id').isMongoId().withMessage('Invalid project ID'),
  body('projectCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project code cannot be empty')
    .isLength({ max: 20 })
    .withMessage('Project code cannot exceed 20 characters')
    .toUpperCase(),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description').optional().trim(),
  body('domain')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Domain cannot exceed 100 characters'),
  body('requiredSkills').optional().isArray().withMessage('Required skills must be an array'),
  body('requiredSkills.*').optional().trim().isString(),
  body('duration')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Duration cannot exceed 50 characters'),
  body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be open or closed'),
];

const projectIdParam = () => [param('id').isMongoId().withMessage('Invalid project ID')];

module.exports = {
  createProjectRules,
  updateProjectRules,
  projectIdParam,
};
