const AlumniTestimonial = require('../models/AlumniTestimonial');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Public: GET /api/alumni
const getActiveAlumni = asyncHandler(async (req, res) => {
  const items = await AlumniTestimonial.find({ isActive: true })
    .sort('-createdAt')
    .lean();
  return sendSuccess(res, '', { alumni: items });
});

// Admin: GET /api/admin/alumni
const getAlumni = asyncHandler(async (req, res) => {
  const items = await AlumniTestimonial.find().sort('-createdAt').lean();
  return sendSuccess(res, '', { alumni: items });
});

// Admin: POST /api/admin/alumni
const createAlumni = asyncHandler(async (req, res) => {
  const { name, branch, batch, company, testimonial, imageUrl, isActive } = req.body;

  if (!name || !company || !testimonial) {
    return sendError(res, 'Name, company and testimonial are required', 400);
  }

  const created = await AlumniTestimonial.create({
    name,
    branch,
    batch,
    company,
    testimonial,
    imageUrl: imageUrl || '',
    isActive: typeof isActive === 'boolean' ? isActive : true,
  });

  return sendSuccess(res, 'Alumni testimonial created', { alumni: created }, 201);
});

// Admin: PUT /api/admin/alumni/:id
const updateAlumni = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };

  const updated = await AlumniTestimonial.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return sendError(res, 'Alumni testimonial not found', 404);
  }

  return sendSuccess(res, 'Alumni testimonial updated', { alumni: updated });
});

// Admin: DELETE /api/admin/alumni/:id
const deleteAlumni = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await AlumniTestimonial.findByIdAndDelete(id);
  if (!deleted) {
    return sendError(res, 'Alumni testimonial not found', 404);
  }
  return sendSuccess(res, 'Alumni testimonial deleted', {});
});

module.exports = {
  getActiveAlumni,
  getAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
};

