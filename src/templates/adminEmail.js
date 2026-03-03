const { generateEmailTemplate } = require('../utils/emailTemplate');

function buildAdminEmail({ name, email, branch, projectTitle, submittedAt, adminUrl }) {
  const safeName = name || 'Student';
  const safeEmail = email || 'N/A';
  const safeBranch = branch || 'N/A';
  const safeProject = projectTitle || 'General Consideration';
  const safeDate = submittedAt || '';
  const safeAdminUrl = adminUrl || '#';

  const content = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#111827; line-height:1.6;">
      <tr>
        <td style="padding-bottom:16px;">
          <h2 style="margin:0 0 8px; font-size:18px; font-weight:600;">New Internship Application Received</h2>
          <p style="margin:0 0 12px;">
            A new application has been submitted to the Director's Internship Program.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0; width:140px; font-weight:600; font-size:13px; color:#374151;">Name</td>
              <td style="padding:6px 0; font-size:13px; color:#111827;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:140px; font-weight:600; font-size:13px; color:#374151;">Email</td>
              <td style="padding:6px 0; font-size:13px; color:#111827;">
                <a href="mailto:${safeEmail}" style="color:#4f46e5; text-decoration:none;">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:140px; font-weight:600; font-size:13px; color:#374151;">Branch</td>
              <td style="padding:6px 0; font-size:13px; color:#111827;">${safeBranch}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:140px; font-weight:600; font-size:13px; color:#374151;">Project</td>
              <td style="padding:6px 0; font-size:13px; color:#111827;">${safeProject}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:140px; font-weight:600; font-size:13px; color:#374151;">Submitted at</td>
              <td style="padding:6px 0; font-size:13px; color:#111827;">${safeDate}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:20px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="left" style="border-radius:9999px; background-color:#4f46e5;">
                <a href="${safeAdminUrl}" style="display:inline-block; padding:10px 22px; font-size:14px; color:#ffffff; text-decoration:none; border-radius:9999px;">
                  View in Admin Panel
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #e5e7eb; padding-top:12px; font-size:12px; color:#6b7280;">
          <p style="margin:0;">
            Director's Internship Program – The Centre for Research, Innovation &amp; Entrepreneurship Lab
          </p>
        </td>
      </tr>
    </table>
  `;

  return generateEmailTemplate({
    title: 'New Internship Application Received',
    content,
  });
}

module.exports = {
  buildAdminEmail,
};

