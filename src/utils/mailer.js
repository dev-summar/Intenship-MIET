const nodemailer = require('nodemailer');
const logger = require('./logger');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = null;

function getTransporter() {
  if (!EMAIL_USER || !EMAIL_PASS) {
    logger.warn(
      'Email credentials are not configured (EMAIL_USER / EMAIL_PASS); email sending is disabled.'
    );
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  return transporter;
}

/**
 * Send an email using the configured transporter.
 * Does not throw on failure; logs error instead.
 *
 * @param {{ to: string | string[], subject: string, html: string }} options
 */
async function sendEmail({ to, subject, html }) {
  try {
    const transport = getTransporter();
    if (!transport) {
      return false;
    }

    const toField = Array.isArray(to) ? to.join(',') : to;
    if (!toField) {
      logger.warn('sendEmail called without recipient');
      return false;
    }

    await transport.sendMail({
      from: EMAIL_USER,
      to: toField,
      subject,
      html,
    });

    return true;
  } catch (err) {
    logger.error('Failed to send email:', err.message);
    return false;
  }
}

module.exports = {
  sendEmail,
};

