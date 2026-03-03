const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const Project = require('../models/Project');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/** POST /api/admin/login — Admin only (local DB). */
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }
  const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'admin' }).select('+password');
  if (!user) {
    return sendError(res, 'Invalid email or password', 401);
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password', 401);
  }
  const token = generateToken(user._id);
  return sendSuccess(res, 'Login successful', {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

/** GET /api/admin/applications — Admin only. */
const getApplications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const applications = await Application.find(filter)
    .populate('student', 'name email')
    .populate('project', 'projectCode title domain')
    .sort('-createdAt')
    .lean();
  return sendSuccess(res, '', { applications });
});

/** PATCH /api/admin/applications/:id/status — Admin only. */
const patchApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return sendError(res, 'Status must be approved or rejected', 400);
  }
  const application = await Application.findById(req.params.id)
    .populate('student', 'name email')
    .populate('project', 'projectCode title');
  if (!application) {
    return sendError(res, 'Application not found', 404);
  }
  if (application.status !== 'pending') {
    return sendError(res, 'Application has already been processed', 400);
  }
  application.status = status;
  if (req.body.remarks != null) application.remarks = req.body.remarks;
  await application.save();
  const updated = await Application.findById(application._id)
    .populate('student', 'name email')
    .populate('project', 'projectCode title')
    .lean();
  return sendSuccess(res, `Application ${status} successfully`, { application: updated });
});

/** GET /api/admin/projects — Admin only (all projects). */
const getProjects = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 100);
  const projects = await Project.find()
    .populate('createdBy', 'name email')
    .sort('-createdAt')
    .limit(limit)
    .lean();
  const total = await Project.countDocuments();
  return sendSuccess(res, '', {
    projects,
    pagination: { total, limit },
  });
});

module.exports = {
  adminLogin,
  getApplications,
  getProjects,
  patchApplicationStatus,
};
