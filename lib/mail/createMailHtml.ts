const autoReplyNoticeHtml = `
              <p style="margin:0 0 12px;font-size:12px;color:#9ca3af;line-height:1.5;">
                Diese E-Mail wurde automatisch erstellt. Bitte antworte nicht darauf, sondern schreib an
                <a href="mailto:festival@b-side.ms" style="color:#d682b5;text-decoration:none;">festival@b-side.ms</a>.
              </p>`;

type MailHtmlOptions = {
    autoReplyNotice?: boolean;
};

const createMailHtml = (content: string, options: MailHtmlOptions = {}): string => {
    const { autoReplyNotice = true } = options;

    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>B-Side Festival 2026</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0e8f0;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0e8f0;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table cellpadding="0" cellspacing="0" style="width:100%;max-width:580px;border-radius:10px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(160deg,#d682b5 0%,#e8c8e0 60%,#f5eef5 100%);padding:32px 40px 28px;">
              <p style="margin:0;font-size:26px;font-weight:800;color:#2a2a2a;line-height:1.1;letter-spacing:-0.01em;">B-Side Festival 2026</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#3fa9f5;padding:0;height:5px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px 8px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f5eef5;border-top:1px solid #e8dce8;padding:20px 40px;">
              ${autoReplyNotice ? autoReplyNoticeHtml : ''}
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#6b7280;line-height:1.4;">B-Side Festival 2026</p>
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;line-height:1.5;">18.–19. September · Münster · B-Side &amp; Hansaviertel</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                <a href="https://festival.b-side.ms" style="color:#d682b5;text-decoration:none;">festival.b-side.ms</a>
                · B-Side Kultur e.V.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const mailParagraphStyle = 'margin:0 0 16px;font-size:15px;color:#374151;line-height:1.65;';
export const mailLinkStyle = 'color:#d682b5;text-decoration:underline;';
export const mailButtonStyle =
    'display:inline-block;background-color:#1d2a6b;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:15px;';

export default createMailHtml;
