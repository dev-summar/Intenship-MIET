const { generateEmailTemplate } = require('../utils/emailTemplate');

function buildStudentEmail({ name, projectTitle, submittedAt, portalUrl }) {
  const safeName = name || 'Student';
  const safeProject = projectTitle || 'General Consideration';
  const safeDate = submittedAt || '';
  const safePortal = portalUrl || '#';

  const content = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#111827; line-height:1.6;">
      <tr>
        <td style="padding-bottom:16px;">
          <p style="margin:0 0 12px;">Dear ${safeName},</p>
          <p style="margin:0 0 12px;">
            Thank you for applying to the <strong>Director's Internship Program</strong>.
            Your application has been received and is currently under review.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:16px;">
          <p style="margin:0 0 8px; font-weight:600;">Application summary</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;">
            <tr>
              <td style="padding:12px 16px;">
                <p style="margin:0 0 4px; font-size:13px;"><strong>Project</strong>: ${safeProject}</p>
                <p style="margin:0; font-size:13px;"><strong>Submitted on</strong>: ${safeDate}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:20px;">
          <p style="margin:0 0 16px;">
            Our mentors will review your profile and reach out to you with the next steps.
            You can revisit the internship portal at any time using the button below.
          </p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="left" style="border-radius:9999px; background-color:#4f46e5;">
                <a href="${safePortal}" style="display:inline-block; padding:10px 20px; font-size:14px; color:#ffffff; text-decoration:none; border-radius:9999px;">
                  Open internship portal
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #e5e7eb; padding-top:12px; font-size:12px; color:#6b7280;">
          <p style="margin:0 0 4px;">
            Director's Internship Program<br/>
            The Centre for Research, Innovation &amp; Entrepreneurship Lab
          </p>
          <p style="margin:0;">This is an automated message. For queries, contact: notifications@mietjammu.in</p>
        </td>
      </tr>
    </table>
  `;

  return generateEmailTemplate({
    title: "Application Received – Director's Internship Program",
    content,
  });
}

module.exports = {
  buildStudentEmail,
};

