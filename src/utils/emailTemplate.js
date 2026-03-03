function generateEmailTemplate({ title, content }) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charSet="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; font-family:Arial, Helvetica, sans-serif;">
            <tr>
              <td style="background-color:#4f46e5; padding:20px 24px; color:#ffffff; text-align:left;">
                <h1 style="margin:0; font-size:18px; font-weight:600;">Director's Internship Program</h1>
                <p style="margin:4px 0 0; font-size:12px; line-height:1.4;">
                  The Centre for Research, Innovation &amp; Entrepreneurship Lab
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#ffffff; padding:24px; border-radius:0 0 8px 8px;">
                ${content}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

module.exports = {
  generateEmailTemplate,
};

