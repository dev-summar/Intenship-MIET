const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    createdBy: req.user.id,
  });
  return sendSuccess(res, 'Project created successfully', { project }, 201);
});

const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return sendSuccess(res, 'Project updated successfully', { project });
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  await project.deleteOne();
  return sendSuccess(res, 'Project deleted successfully', {});
});

const getAllProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const projects = await Project.find()
    .populate('createdBy', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await Project.countDocuments();
  return sendSuccess(res, '', {
    projects,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getOpenProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const projects = await Project.find({ status: 'open' })
    .populate('createdBy', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await Project.countDocuments({ status: 'open' });
  return sendSuccess(res, '', {
    projects,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    'createdBy',
    'name email'
  );
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  return sendSuccess(res, '', { project });
});

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getOpenProjects,
  getProjectById,
};
