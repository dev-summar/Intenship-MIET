const HomepageContent = require('../models/HomepageContent');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Public: GET /api/homepage
const getHomepage = asyncHandler(async (req, res) => {
  let doc = await HomepageContent.findById('singleton').lean();

  if (!doc) {
    // Create with defaults if not present
    doc = await HomepageContent.create({ _id: 'singleton' });
    doc = doc.toObject();
  }

  return sendSuccess(res, '', { homepage: doc });
});

// Admin: PUT /api/admin/homepage
const updateHomepage = asyncHandler(async (req, res) => {
  const payload = {};
  const allowedFields = [
    'centreName',
    'programName',
    'heroTitle',
    'heroSubtitle',
    'liveProjects',
    'interns',
    'domains',
    'aboutTitle',
    'aboutDescription',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      payload[field] = req.body[field];
    }
  });

  const updated = await HomepageContent.findByIdAndUpdate(
    'singleton',
    { $set: payload },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  if (!updated) {
    return sendError(res, 'Failed to update homepage content', 500);
  }

  return sendSuccess(res, 'Homepage content updated', { homepage: updated });
});

module.exports = {
  getHomepage,
  updateHomepage,
};

