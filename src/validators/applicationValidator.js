const { body, param } = require('express-validator');

const applyRules = () => [
  body('project')
    .optional({ values: 'null' })
    .custom((v) => v === null || v === undefined || v === '' || (typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v)))
    .withMessage('Invalid project ID'),
  body('sop').trim().notEmpty().withMessage('Statement of purpose is required'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('skills.*').optional().trim().isString(),
  body('resumeUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Resume URL must be a valid URL'),
];

const applicationIdParam = () => [
  param('id').isMongoId().withMessage('Invalid application ID'),
];

const approveRejectRules = () => [
  param('id').isMongoId().withMessage('Invalid application ID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be approved or rejected'),
  body('remarks').optional().trim(),
  body('assignedMentor')
    .optional()
    .isMongoId()
    .withMessage('Invalid mentor ID'),
];

module.exports = {
  applyRules,
  applicationIdParam,
  approveRejectRules,
};
