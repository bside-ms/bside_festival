const escapeHtml = (value: string): string =>
    value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

type Block = { kind: 'p' | 'slot' | 'quote'; text: string };

/** Standalone slot line only (must start with weekday). Dates inside prose must NOT match. */
const STANDALONE_SLOT_RE = /^(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag),\s+\d{2}\.\d{2}\.\d{4},\s+.+\bUhr\b,.+$/;

const isStandaloneSlotParagraph = (paragraph: string): boolean => {
    const trimmed = paragraph.trim();
    if (trimmed.includes('\n')) {
        return false;
    }
    // Extra sentences in the same paragraph → normal prose, not a slot box
    if (trimmed.includes('. ')) {
        return false;
    }
    return STANDALONE_SLOT_RE.test(trimmed);
};

const normalizeNewlines = (value: string): string => value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

/** Strip [[slot]] / [[quote]] markers for the plain-text MIME part. */
export const festivalMailPlainText = (rawBody: string): string =>
    normalizeNewlines(rawBody)
        .replace(/\[\[\/?(?:slot|quote)\]\]\n?/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\n+/, '')
        .replace(/\s+$/, '\n');

const splitParagraphs = (chunk: string): Array<string> =>
    chunk
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean);

const parseMarkedBlocks = (rawBody: string): Array<Block> => {
    const source = normalizeNewlines(rawBody).trim();
    const blocks: Array<Block> = [];
    const markerRe = /\[\[(slot|quote)\]\]\n?([\s\S]*?)\n?\[\[\/\1\]\]/g;
    let cursor = 0;

    const pushProse = (chunk: string): void => {
        for (const paragraph of splitParagraphs(chunk)) {
            blocks.push({ kind: isStandaloneSlotParagraph(paragraph) ? 'slot' : 'p', text: paragraph });
        }
    };

    for (const match of Array.from(source.matchAll(markerRe))) {
        const index = match.index ?? 0;
        if (index > cursor) {
            pushProse(source.slice(cursor, index));
        }
        const kind = match[1] as 'slot' | 'quote';
        const inner = (match[2] ?? '').trim();
        if (inner) {
            blocks.push({ kind, text: inner });
        }
        cursor = index + match[0].length;
    }

    if (cursor < source.length) {
        pushProse(source.slice(cursor));
    }

    return blocks;
};

const paragraphHtml = (text: string): string => escapeHtml(text).replaceAll('\n', '<br>');

const renderBlock = (block: Block): string => {
    if (block.kind === 'slot') {
        return `<p style="margin:0 0 16px;padding:14px 16px;background-color:#eaf5fe;border-left:4px solid #3fa9f5;border-radius:6px;font-size:15px;color:#111827;line-height:1.65;"><strong>${paragraphHtml(block.text)}</strong></p>`;
    }
    if (block.kind === 'quote') {
        const quoteBody = splitParagraphs(block.text)
            .map(
                (paragraph) =>
                    `<p style="margin:0 0 12px;font-size:14px;color:#4b5563;line-height:1.65;font-style:italic;">${paragraphHtml(paragraph)}</p>`,
            )
            .join('\n');
        return `<div style="margin:0 0 16px;padding:14px 16px;background-color:#f9fafb;border-left:4px solid #d682b5;border-radius:6px;">${quoteBody}</div>`;
    }
    return `<p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.65;">${paragraphHtml(block.text)}</p>`;
};

/** Branded HTML shell. Slot/quote via standalone slot lines or explicit [[slot]] / [[quote]]. */
export const festivalMailHtml = (rawBody: string): string => {
    const bodyHtml = parseMarkedBlocks(rawBody).map(renderBlock).join('\n');

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
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f5eef5;border-top:1px solid #e8dce8;padding:20px 40px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#6b7280;line-height:1.4;">B-Side Festival 2026</p>
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;line-height:1.5;">18.–20. September · Münster · B-Side &amp; Hansaviertel</p>
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
