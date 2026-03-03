/**
 * API response messages. Override via env where needed (e.g. APPLICATION_SUCCESS_MESSAGE).
 */
module.exports = {
  application: {
    submitSuccess: process.env.APPLICATION_SUCCESS_MESSAGE || 'Application submitted successfully',
    projectNotFound: 'Project not found',
    projectNotOpen: 'Project is not open for applications',
    duplicateApplication: 'You have already applied to this project',
  },
};
