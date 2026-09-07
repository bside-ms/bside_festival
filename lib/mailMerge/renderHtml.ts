import { escapeHtml } from '@/lib/mail/escapeHtml';

export const renderMailMergeHtml = (body: string): string => {
    const paragraphs = body
        .replaceAll('\r\n', '\n')
        .replaceAll('\r', '\n')
        .trim()
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0)
        .map(
            (paragraph) =>
                `<p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#111111;">${escapeHtml(paragraph).replaceAll('\n', '<br>')}</p>`,
        )
        .join('');

    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:24px 20px;">
    ${paragraphs}
  </div>
</body>
</html>`;
};
