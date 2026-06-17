// Send confirmation mails to applicants by participant ID.
//
// Local:      npx tsx scripts/sendConfirmationMails.ts 1,2,3
// Production: docker exec -it <container> npx tsx scripts/sendConfirmationMails.ts 1,2,3

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { createTransport } from 'nodemailer';

const SYSTEM_AUTHOR_NAME = 'System';
const SYSTEM_AUTHOR_USER_ID = 'system';
const CONFIRMATION_COMMENT = 'Bestätigungsmail versendet.';

const createPrisma = () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set');
    }
    return new PrismaClient({ adapter: new PrismaMariaDb(databaseUrl) });
};

const createMailer = () =>
    createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: !['true', 'True', '1'].includes(process.env.MAIL_INSECURE ?? ''),
        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
    });

const buildHtml = (name: string): string => `<!DOCTYPE html>
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

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(160deg,#d682b5 0%,#e8c8e0 60%,#f5eef5 100%);padding:32px 40px 28px;">
              <p style="margin:0;font-size:26px;font-weight:800;color:#2a2a2a;line-height:1.1;letter-spacing:-0.01em;">B-Side Festival 2026</p>
            </td>
          </tr>

          <!-- Blue accent bar -->
          <tr>
            <td style="background-color:#3fa9f5;padding:0;height:5px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px 8px;">
              <p style="margin:0 0 24px;font-size:20px;font-weight:700;color:#000000;line-height:1.3;">Hallo ${name}! :)</p>

              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.65;">
                Vielen Dank für die Bewerbung und das Interesse am B-Side Festival 2026!
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.65;">
                Wir freuen uns sehr über die vielen spannenden Bewerbungen und darüber, dass so viele
                Künstler*innen, Kreative und Initiativen Teil des Festivals werden möchten.
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.65;">
                Aktuell sitzen wir auf Hochtouren an der Kuration des Programms und schauen uns alle
                eingegangenen Bewerbungen sorgfältig an. Uns ist wichtig, jeder Bewerbung die
                Aufmerksamkeit zu schenken, die sie verdient. Daher nehmen wir uns die Zeit, alle
                Künstler*innen, Projekte und Beiträge gründlich zu prüfen.
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.65;">
                Gleichzeitig geben wir unser Bestes, den Auswahlprozess so zügig wie möglich
                abzuschließen, damit wir möglichst schnell eine Rückmeldung geben können.
                Mit einer Nachricht von uns ist im Juli zu rechnen.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.65;">
                Vielen Dank für die Zeit, die Mühe und das Vertrauen, das in die Bewerbung geflossen
                ist. Wir wissen das sehr zu schätzen und freuen uns über das große Interesse am
                B-Side Festival.
              </p>

              <!-- Links box -->
              <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;background-color:#eaf5fe;border-radius:6px;border-left:4px solid #3fa9f5;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#000000;text-transform:uppercase;letter-spacing:0.1em;">Aktuelle Infos</p>
                    <p style="margin:0 0 4px;font-size:14px;">
                      <a href="http://festival.b-side.ms/" style="color:#3fa9f5;text-decoration:none;font-weight:600;">festival.b-side.ms</a>
                    </p>
                    <p style="margin:0;font-size:14px;">
                      <a href="https://www.instagram.com/bside.festival.ms/" style="color:#3fa9f5;text-decoration:none;font-weight:600;">@bside.festival.ms</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 36px;font-size:15px;color:#374151;line-height:1.65;">
                Liebe Grüße<br>
                <strong style="color:#000000;">Euer B-Side Festival-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f5eef5;border-top:1px solid #e8dce8;padding:18px 40px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                Diese E-Mail wurde automatisch generiert — bitte nicht darauf antworten.
                Für Rückfragen: <a href="mailto:festival@b-side.ms" style="color:#d682b5;text-decoration:none;">festival@b-side.ms</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const main = async () => {
    const arg = process.argv[2];
    if (!arg) {
        console.error('Usage: tsx scripts/sendConfirmationMails.ts <id1,id2,...>');
        process.exit(1);
    }

    const ids = arg
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));

    if (ids.length === 0) {
        console.error('No valid numeric IDs provided.');
        process.exit(1);
    }

    console.log(`Processing ${ids.length} participant(s)…\n`);

    const prisma = createPrisma();
    const mailer = createMailer();

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const id of ids) {
        const participant = await prisma.participant.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                contactMail: true,
                comments: { select: { authorName: true, authorUserId: true, text: true } },
            },
        });

        if (!participant) {
            console.error(`[NOT FOUND]  ID ${id}`);
            failed++;
            continue;
        }

        const alreadySent = participant.comments.some((c) => c.authorUserId === SYSTEM_AUTHOR_USER_ID && c.text === CONFIRMATION_COMMENT);

        if (alreadySent) {
            console.log(`[SKIPPED]    ${participant.name} (ID ${id}) — confirmation mail already sent`);
            skipped++;
            continue;
        }

        try {
            const info = await mailer.sendMail({
                from: '"B-Side Festival" <no-reply@b-side.ms>',
                replyTo: 'festival@b-side.ms',
                to: participant.contactMail,
                subject: 'B-Side Festival 2026 – Deine Bewerbung',
                html: buildHtml(participant.name),
            });

            if (info.accepted.length === 0) {
                throw new Error('Accepted list is empty');
            }

            await prisma.comment.create({
                data: {
                    authorName: SYSTEM_AUTHOR_NAME,
                    authorUserId: SYSTEM_AUTHOR_USER_ID,
                    participantId: id,
                    text: CONFIRMATION_COMMENT,
                },
            });

            console.log(`[SENT]       ${participant.name} (ID ${id}) → ${participant.contactMail}`);
            sent++;
        } catch (error) {
            console.error(`[ERROR]      ${participant.name} (ID ${id}): ${error instanceof Error ? error.message : String(error)}`);
            failed++;
        }
    }

    console.log(`\nDone — sent: ${sent}, skipped: ${skipped}, failed: ${failed}`);
    await prisma.$disconnect();
};

main().catch((error) => {
    console.error('Fatal:', error);
    process.exit(1);
});
