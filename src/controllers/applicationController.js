const Application = require('../models/Application');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { sendEmail } = require('../utils/mailer');
const { buildStudentEmail } = require('../templates/studentEmail');
const { buildAdminEmail } = require('../templates/adminEmail');
const messages = require('../config/messages').application;

const apply = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    return sendError(res, 'Only students can submit applications', 403);
  }
  const { project, sop, resumeUrl } = req.body;
  const skills = req.body.skills;

  const projectId = project && project.toString().trim() ? project : null;

  if (projectId) {
    const projectDoc = await Project.findById(projectId);
    if (!projectDoc) {
      return sendError(res, messages.projectNotFound, 404);
    }
    if (projectDoc.status !== 'open') {
      return sendError(res, messages.projectNotOpen, 400);
    }
  }

  const existing = await Application.findOne({
    student: req.user.id,
    project: projectId,
  });
  if (existing) {
    return sendError(res, messages.duplicateApplication, 409);
  }

  const application = await Application.create({
    student: req.user.id,
    project: projectId,
    sop,
    skills: Array.isArray(skills) ? skills : [],
    resumeUrl: resumeUrl ? String(resumeUrl).trim() : '',
    status: 'pending',
  });

  const populated = await Application.findById(application._id)
    .populate('project', 'projectCode title domain')
    .populate('student', 'name email')
    .lean();

  // Fire-and-forget emails (do not affect main response)
  try {
    const studentName = populated.student?.name || 'Student';
    const studentEmail = populated.student?.email;
    const projectTitle = populated.project?.title || 'General Consideration';
    const timestamp = new Date().toISOString();
    const portalUrl = process.env.CLIENT_URL || '#';
    const adminUrlBase = (process.env.CLIENT_URL || '').replace(/\/$/, '');
    const adminUrl = adminUrlBase ? `${adminUrlBase}/admin` : '#';

    // Student confirmation email
    if (studentEmail) {
      const studentSubject = "Application Received – Director's Internship Program";
      const studentHtml = buildStudentEmail({
        name: studentName,
        projectTitle,
        submittedAt: timestamp,
        portalUrl,
      });

      sendEmail({ to: studentEmail, subject: studentSubject, html: studentHtml });
    }

    // Admin notification email
    const adminEnv = process.env.ADMIN_EMAIL || '';
    const adminRecipients = adminEnv
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    if (adminRecipients.length > 0) {
      const adminSubject = 'New Internship Application Received';
      const adminHtml = buildAdminEmail({
        name: studentName,
        email: studentEmail,
        branch: 'N/A',
        projectTitle,
        submittedAt: timestamp,
        adminUrl,
      });

      sendEmail({ to: adminRecipients, subject: adminSubject, html: adminHtml });
    }
  } catch (err) {
    // Never block the response on email failures
    // Errors are already logged in mailer
  }

  return sendSuccess(res, messages.submitSuccess, populated, 201);
});

const getMyApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    return sendError(res, 'Only students can view their applications', 403);
  }
  const applications = await Application.find({ student: req.user.id })
    .populate('project', 'projectCode title domain status')
    .sort('-createdAt')
    .lean();
  return sendSuccess(res, '', { applications });
});

module.exports = {
  apply,
  getMyApplications,
};
