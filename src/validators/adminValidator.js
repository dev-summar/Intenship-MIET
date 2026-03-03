const { body, param } = require('express-validator');

const adminLoginRules = () => [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const applicationIdParam = () => [param('id').isMongoId().withMessage('Invalid application ID')];

const patchStatusRules = () => [
  param('id').isMongoId().withMessage('Invalid application ID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be approved or rejected'),
  body('remarks').optional().trim(),
];

module.exports = {
  adminLoginRules,
  applicationIdParam,
  patchStatusRules,
};
