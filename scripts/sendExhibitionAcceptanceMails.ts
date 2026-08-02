// Send acceptance (Zusage) mails to slotted exhibitions by participant ID.
//
// Eligibility (checked at send time):
//   - type Exhibition
//   - status Applied (or already WaitingForConfirmation only for skip/idempotency)
//   - at least one ScheduleEntry (kind Participant) with location + timed start
//   - feeEuros set
//
// Planned recipients (Rückmeldungen 2026 Ausstellungen) — skip 762 RICH (already notified):
//   FR+SA GR01: 595, 624, 655, 751, 760
//   SA only:    651
//
// Live (no Taskfile; service festival-node):
//   docker compose run --rm --entrypoint npm festival-node run send-exhibition-acceptance-mails -- --list
//   docker compose run --rm --entrypoint npm festival-node run send-exhibition-acceptance-mails -- --dry-run 595,624
//   docker compose run --rm --entrypoint npm festival-node run send-exhibition-acceptance-mails -- 595
//
// Local (Taskfile / service app):
//   task send-exhibition-acceptance-mails -- --list
//   task send-exhibition-acceptance-mails -- --dry-run 595,624,655,751,760,651
//   task send-exhibition-acceptance-mails -- 595,624,655,751,760,651

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient, type ApplicationStatus, type ScheduleEntryTimeMode, type Type } from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';
import { de } from 'date-fns/locale';
import 'dotenv/config';
import { createTransport } from 'nodemailer';

const SYSTEM_AUTHOR_NAME = 'System';
const SYSTEM_AUTHOR_USER_ID = 'system';
const ACCEPTANCE_COMMENT = 'Zusagemail versendet — Rückmeldung erbeten bis 10.08.2026.';
const TARGET_STATUS: ApplicationStatus = 'WaitingForConfirmation';
const REPLY_DEADLINE = '10.08.2026';

type FormKind = 'singular' | 'plural';

type ScheduleSlot = {
    startsAt: Date | null;
    endsAt: Date | null;
    timeMode: ScheduleEntryTimeMode;
    programLocation: {
        id: number;
        name: string;
        programLocationArea: { name: string } | null;
    };
};

type EligibleParticipant = {
    id: number;
    name: string;
    updatedName: string | null;
    contactName: string | null;
    contactMail: string;
    participantCount: number;
    feeEuros: number | null;
    status: ApplicationStatus;
    type: Type;
    scheduleEntries: ScheduleSlot[];
    comments: Array<{ authorUserId: string; text: string; statusTransition: ApplicationStatus | null }>;
};

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

const escapeHtml = (value: string): string =>
    value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const formatBerlin = (date: Date, pattern: string): string => formatInTimeZone(date, 'Europe/Berlin', pattern, { locale: de });

const displayActName = (participant: Pick<EligibleParticipant, 'name' | 'updatedName'>): string =>
    (participant.updatedName?.trim() || participant.name).trim();

const displayContactName = (participant: Pick<EligibleParticipant, 'contactName' | 'name' | 'updatedName'>): string =>
    participant.contactName?.trim() || displayActName(participant);

const chooseForm = (participantCount: number): FormKind => (participantCount > 1 ? 'plural' : 'singular');

const formatFee = (feeEuros: number): string =>
    new Intl.NumberFormat('de-DE', {
        currency: 'EUR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        style: 'currency',
    }).format(feeEuros);

const formatLocationLabel = (slot: ScheduleSlot): string => {
    const location = slot.programLocation.name.trim();
    const area = slot.programLocation.programLocationArea?.name.trim();
    if (area !== undefined && area.length > 0) {
        return `${area}, ${location}`;
    }
    return location;
};

const formatTimePart = (slot: ScheduleSlot): string => {
    if (slot.timeMode === 'AllDay' || slot.startsAt === null) {
        return 'ganztägig';
    }

    const datePart = formatBerlin(slot.startsAt, 'EEEE, dd.MM.yyyy');

    if (slot.endsAt !== null) {
        const startTime = formatBerlin(slot.startsAt, 'HH:mm');
        const endTime = formatBerlin(slot.endsAt, 'HH:mm');
        return `${datePart}, ${startTime}–${endTime} Uhr`;
    }

    return `${datePart}, ${formatBerlin(slot.startsAt, "'ab' HH:mm 'Uhr'")}`;
};

const formatSlotLine = (slot: ScheduleSlot): string => {
    const location = formatLocationLabel(slot);

    if (slot.timeMode === 'AllDay' || slot.startsAt === null) {
        return `ganztägig, ${location}`;
    }

    return `${formatTimePart(slot)}, ${location}`;
};

const sortSlots = (slots: ScheduleSlot[]): ScheduleSlot[] =>
    [...slots].sort((a, b) => {
        const aTime = a.startsAt?.getTime() ?? Number.POSITIVE_INFINITY;
        const bTime = b.startsAt?.getTime() ?? Number.POSITIVE_INFINITY;
        return aTime - bTime;
    });

const isSameLocationMultiDay = (slots: ScheduleSlot[]): boolean => {
    if (slots.length < 2) {
        return false;
    }
    const firstId = slots[0]!.programLocation.id;
    return slots.every((slot) => slot.programLocation.id === firstId);
};

const formatSlotBlock = (slots: ScheduleSlot[]): string => {
    const ordered = sortSlots(slots);

    if (isSameLocationMultiDay(ordered)) {
        const location = escapeHtml(formatLocationLabel(ordered[0]!));
        const times = ordered.map((slot) => escapeHtml(formatTimePart(slot))).join('<br>');
        return `${location}<br>${times}`;
    }

    return ordered.map((slot) => escapeHtml(formatSlotLine(slot))).join('<br>');
};

type BodyBlock = { kind: 'p' | 'heading' | 'slot' | 'festivalDays'; html: string };

const festivalDaysHtml = `
<ul style="margin:0 0 16px;padding-left:20px;font-size:15px;color:#374151;line-height:1.65;">
  <li style="margin-bottom:6px;">Freitag, 18.09. — mehrere Bühnen und Orte in und rund um das B-Side-Gebäude</li>
  <li style="margin-bottom:6px;">Samstag, 19.09. — mehrere Bühnen und Orte in und rund um das B-Side-Gebäude sowie an ausgewählten Locations im Hansaviertel</li>
  <li>In der Nacht von Samstag auf Sonntag (20.09.) — Aftershow-Party in der Sputnikhalle</li>
</ul>
`;

const buildBodyBlocks = (
    form: FormKind,
    actName: string,
    slotLinesHtml: string,
    feeLabel: string,
    slotCount: number,
    sameLocationMultiDay: boolean,
): BodyBlock[] => {
    const p = (html: string): BodyBlock => ({ kind: 'p', html });
    const heading = (html: string): BodyBlock => ({ kind: 'heading', html });

    const slotIntroSingular = sameLocationMultiDay
        ? 'Für deine Ausstellung haben wir folgenden vorläufigen Ort und diese Öffnungszeiten vorgesehen:'
        : slotCount > 1
          ? 'Für deine Ausstellung haben wir folgende vorläufige Öffnungszeiten und Orte vorgesehen:'
          : 'Für deine Ausstellung haben wir folgenden vorläufigen Ort und Öffnungszeit vorgesehen:';
    const slotIntroPlural = sameLocationMultiDay
        ? 'Für eure Ausstellung haben wir folgenden vorläufigen Ort und diese Öffnungszeiten vorgesehen:'
        : slotCount > 1
          ? 'Für eure Ausstellung haben wir folgende vorläufige Öffnungszeiten und Orte vorgesehen:'
          : 'Für eure Ausstellung haben wir folgenden vorläufigen Ort und Öffnungszeit vorgesehen:';

    if (form === 'singular') {
        return [
            p(
                'in den vergangenen Tagen und Wochen haben wir in vielen Arbeitssessions insgesamt knapp 275 Bewerbungen für das B-Side Festival 2026 in Münster gesichtet. Vielen Dank, dass du unserem größtenteils ehrenamtlichen Team die Zeit gegeben hast, alle Bewerbungen sorgfältig durchzugehen.',
            ),
            p(
                `Umso mehr freuen wir uns, dir mitteilen zu können, dass wir deine Ausstellung <strong>${actName}</strong> beim B-Side Festival 2026 zeigen möchten!`,
            ),
            p('Das diesjährige Festival findet an zwei Tagen statt:'),
            { kind: 'festivalDays', html: festivalDaysHtml },
            p(slotIntroSingular),
            { kind: 'slot', html: slotLinesHtml },
            p(
                'Bitte beachte, dass es aus organisatorischen Gründen beim konkreten Ort und den Öffnungszeiten auf dem Festival noch zu Verschiebungen kommen kann. Wir geben natürlich unser Bestes, dass sich an der oben genannten Ausstellung nichts mehr ändert.',
            ),
            p(
                'Details zum Aufbau und Abbau, zu Zugangszeiten und was du vor Ort brauchst, schicken wir dir nach deiner verbindlichen Zusage in einer separaten Mail. Bis dahin musst du dich noch nicht um Logistik kümmern.',
            ),
            p(
                '<strong>Wichtig:</strong> Bitte halte deine Ausstellung und deine Teilnahme noch bis zur offiziellen Bekanntgabe vertraulich.',
            ),
            heading('Gage'),
            p(
                'Das B-Side Festival ist ein eintrittsfreies, fast komplett ehrenamtlich organisiertes Festival, das seit 2016 versucht, einen Gegenpol zu typischen kommerziellen Musikveranstaltungen zu gestalten. Wir finanzieren uns ausschließlich durch öffentliche Fördergelder und Spenden und können aus diesem Grund derzeit für jede Ausstellung lediglich eine Aufwandsentschädigung zahlen.',
            ),
            p(`Für deine Ausstellung können wir dir eine Aufwandsentschädigung in Höhe von <strong>${feeLabel}</strong> bezahlen.`),
            heading('Rückmeldung'),
            p(
                `Damit wir das Programm zeitnah finalisieren können, bitten wir bis spätestens zum ${REPLY_DEADLINE} um eine Rückmeldung, ob du mit deiner Ausstellung dabei sein kannst.`,
            ),
            p(
                'Wir freuen uns auf deine Rückmeldung und hoffen, dich mit deiner Ausstellung im September beim B-Side Festival 2026 begrüßen zu dürfen!',
            ),
            p('Bitte antworte direkt auf diese E-Mail. So können wir deine Rückmeldung schnell und eindeutig der Bewerbung zuordnen.'),
            p('Liebe Grüße,<br>Das Festival Team für den B-Side Kultur e.V.'),
        ];
    }

    return [
        p(
            'in den vergangenen Tagen und Wochen haben wir in vielen Arbeitssessions insgesamt knapp 275 Bewerbungen für das B-Side Festival 2026 in Münster gesichtet. Vielen Dank, dass ihr unserem größtenteils ehrenamtlichen Team die Zeit gegeben habt, alle Bewerbungen sorgfältig durchzugehen.',
        ),
        p(
            `Umso mehr freuen wir uns, euch mitteilen zu können, dass wir eure Ausstellung <strong>${actName}</strong> beim B-Side Festival 2026 zeigen möchten!`,
        ),
        p('Das diesjährige Festival findet an zwei Tagen statt:'),
        { kind: 'festivalDays', html: festivalDaysHtml },
        p(slotIntroPlural),
        { kind: 'slot', html: slotLinesHtml },
        p(
            'Bitte beachtet, dass es aus organisatorischen Gründen beim konkreten Ort und den Öffnungszeiten auf dem Festival noch zu Verschiebungen kommen kann. Wir geben natürlich unser Bestes, dass sich an der oben genannten Ausstellung nichts mehr ändert.',
        ),
        p(
            'Details zum Aufbau und Abbau, zu Zugangszeiten und was ihr vor Ort braucht, schicken wir euch nach eurer verbindlichen Zusage in einer separaten Mail. Bis dahin müsst ihr euch noch nicht um Logistik kümmern.',
        ),
        p('<strong>Wichtig:</strong> Bitte haltet eure Ausstellung und eure Teilnahme noch bis zur offiziellen Bekanntgabe vertraulich.'),
        heading('Gage'),
        p(
            'Das B-Side Festival ist ein eintrittsfreies, fast komplett ehrenamtlich organisiertes Festival, das seit 2016 versucht, einen Gegenpol zu typischen kommerziellen Musikveranstaltungen zu gestalten. Wir finanzieren uns ausschließlich durch öffentliche Fördergelder und Spenden und können aus diesem Grund derzeit für jede Ausstellung lediglich eine Aufwandsentschädigung zahlen.',
        ),
        p(`Für eure Ausstellung können wir euch eine Aufwandsentschädigung in Höhe von <strong>${feeLabel}</strong> bezahlen.`),
        heading('Rückmeldung'),
        p(
            `Damit wir das Programm zeitnah finalisieren können, bitten wir bis spätestens zum ${REPLY_DEADLINE} um eine Rückmeldung, ob ihr mit eurer Ausstellung dabei sein könnt.`,
        ),
        p(
            'Wir freuen uns auf eure Rückmeldung und hoffen, euch mit eurer Ausstellung im September beim B-Side Festival 2026 begrüßen zu dürfen!',
        ),
        p('Bitte antwortet direkt auf diese E-Mail. So können wir eure Rückmeldung schnell und eindeutig der Bewerbung zuordnen.'),
        p('Liebe Grüße,<br>Das Festival Team für den B-Side Kultur e.V.'),
    ];
};

const renderBodyBlocks = (blocks: BodyBlock[]): string =>
    blocks
        .map((block) => {
            if (block.kind === 'festivalDays') {
                return block.html;
            }
            if (block.kind === 'slot') {
                return `<p style="margin:0 0 16px;padding:14px 16px;background-color:#eaf5fe;border-left:4px solid #3fa9f5;border-radius:6px;font-size:15px;color:#111827;line-height:1.65;"><strong>${block.html}</strong></p>`;
            }
            if (block.kind === 'heading') {
                return `<p style="margin:24px 0 8px;font-size:16px;font-weight:700;color:#000000;line-height:1.3;">${block.html}</p>`;
            }
            return `<p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.65;">${block.html}</p>`;
        })
        .join('\n');

const buildHtml = (participant: EligibleParticipant): { form: FormKind; html: string; subject: string; previewText: string } => {
    const form = chooseForm(participant.participantCount);
    const contactName = escapeHtml(displayContactName(participant));
    const actName = escapeHtml(displayActName(participant));
    const feeLabel = escapeHtml(formatFee(participant.feeEuros!));
    const sameLocationMultiDay = isSameLocationMultiDay(participant.scheduleEntries);
    const slotLinesHtml = formatSlotBlock(participant.scheduleEntries);
    const bodyHtml = renderBodyBlocks(
        buildBodyBlocks(form, actName, slotLinesHtml, feeLabel, participant.scheduleEntries.length, sameLocationMultiDay),
    );

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>B-Side Festival 2026 – Zusage</title>
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
              <p style="margin:0 0 24px;font-size:20px;font-weight:700;color:#000000;line-height:1.3;">Hallo ${contactName},</p>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f5eef5;border-top:1px solid #e8dce8;padding:18px 40px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                ${form === 'singular' ? 'Bitte antworte direkt auf diese E-Mail.' : 'Bitte antwortet direkt auf diese E-Mail.'}
                Alternativ: <a href="mailto:festival@b-side.ms" style="color:#d682b5;text-decoration:none;">festival@b-side.ms</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const subject =
        form === 'singular'
            ? `B-Side Festival 2026 – Zusage für deine Ausstellung ${displayActName(participant)}`
            : `B-Side Festival 2026 – Zusage für eure Ausstellung ${displayActName(participant)}`;
    const previewText = `${displayContactName(participant)} · ${form} · ${formatSlotLine(participant.scheduleEntries[0]!)} · ${formatFee(participant.feeEuros!)}`;

    return { form, html, subject, previewText };
};

const participantSelect = {
    id: true,
    name: true,
    updatedName: true,
    contactName: true,
    contactMail: true,
    participantCount: true,
    feeEuros: true,
    status: true,
    type: true,
    scheduleEntries: {
        where: { kind: 'Participant' as const },
        select: {
            startsAt: true,
            endsAt: true,
            timeMode: true,
            programLocation: {
                select: {
                    id: true,
                    name: true,
                    programLocationArea: { select: { name: true } },
                },
            },
        },
        orderBy: { startsAt: 'asc' as const },
    },
    comments: {
        select: { authorUserId: true, text: true, statusTransition: true },
    },
} as const;

const hasConcreteSlot = (participant: EligibleParticipant): boolean =>
    participant.scheduleEntries.some((entry) => entry.programLocation.name.trim().length > 0 && entry.startsAt !== null);

const alreadySent = (participant: EligibleParticipant): boolean =>
    participant.comments.some((comment) => comment.authorUserId === SYSTEM_AUTHOR_USER_ID && comment.text === ACCEPTANCE_COMMENT);

const explainIneligibility = (participant: EligibleParticipant): string | null => {
    if (participant.type !== 'Exhibition') {
        return `Typ ist ${participant.type}, erwartet Exhibition`;
    }
    if (alreadySent(participant)) {
        return 'Zusagemail bereits versendet';
    }
    if (participant.status === TARGET_STATUS) {
        return 'Status ist bereits „Zusage offen“';
    }
    if (participant.status !== 'Applied') {
        return `Status ist ${participant.status}, erwartet Applied`;
    }
    if (participant.feeEuros === null) {
        return 'keine Gage (feeEuros) gesetzt';
    }
    if (!hasConcreteSlot(participant)) {
        return 'kein konkreter Slot (startsAt + Location)';
    }
    return null;
};

const loadParticipant = async (prisma: PrismaClient, id: number): Promise<EligibleParticipant | null> =>
    prisma.participant.findUnique({
        where: { id },
        select: participantSelect,
    });

const listEligible = async (prisma: PrismaClient): Promise<EligibleParticipant[]> => {
    const candidates = await prisma.participant.findMany({
        where: {
            type: 'Exhibition',
            status: 'Applied',
            feeEuros: { not: null },
            scheduleEntries: { some: { kind: 'Participant', startsAt: { not: null } } },
        },
        select: participantSelect,
        orderBy: { id: 'asc' },
    });

    return candidates.filter((participant) => explainIneligibility(participant) === null);
};

const parseArgs = (argv: string[]): { mode: 'list' | 'dry-run' | 'send'; ids: number[] } => {
    const args = argv.slice(2).filter((arg) => arg.length > 0);

    if (args.includes('--list') || args[0] === 'list') {
        return { mode: 'list', ids: [] };
    }

    const dryRun = args.includes('--dry-run');
    const idArg = args.find((arg) => arg !== '--dry-run' && arg !== '--list');

    if (!idArg) {
        console.error('Usage:');
        console.error('  tsx scripts/sendExhibitionAcceptanceMails.ts --list');
        console.error('  tsx scripts/sendExhibitionAcceptanceMails.ts --dry-run <id1,id2,...>');
        console.error('  tsx scripts/sendExhibitionAcceptanceMails.ts <id1,id2,...>');
        process.exit(1);
    }

    const ids = idArg
        .split(',')
        .map((value) => parseInt(value.trim(), 10))
        .filter((value) => !Number.isNaN(value));

    if (ids.length === 0) {
        console.error('No valid numeric IDs provided.');
        process.exit(1);
    }

    return { mode: dryRun ? 'dry-run' : 'send', ids };
};

const printEligibleRow = (participant: EligibleParticipant): void => {
    const form = chooseForm(participant.participantCount);
    const actName = displayActName(participant);
    const slots = participant.scheduleEntries.map((slot) => formatSlotLine(slot)).join(' | ');
    console.log(
        `${String(participant.id).padStart(4, ' ')} | ${form.padEnd(8, ' ')} | ${String(participant.feeEuros).padStart(3, ' ')}€ | n=${participant.participantCount} | ${actName} | ${participant.contactMail} | ${slots}`,
    );
};

const processParticipant = async (
    prisma: PrismaClient,
    mailer: ReturnType<typeof createMailer>,
    id: number,
    dryRun: boolean,
): Promise<'sent' | 'skipped' | 'failed'> => {
    const participant = await loadParticipant(prisma, id);

    if (!participant) {
        console.error(`[NOT FOUND]  ID ${id}`);
        return 'failed';
    }

    const reason = explainIneligibility(participant);
    if (reason !== null) {
        console.log(`[SKIPPED]    ${displayActName(participant)} (ID ${id}) — ${reason}`);
        return 'skipped';
    }

    const { form, html, subject, previewText } = buildHtml(participant);

    if (dryRun) {
        console.log(`[DRY-RUN]    ${displayActName(participant)} (ID ${id})`);
        console.log(`             to: ${participant.contactMail}`);
        console.log(`             form: ${form} (participantCount=${participant.participantCount})`);
        console.log(`             subject: ${subject}`);
        console.log(`             preview: ${previewText}`);
        console.log(`             status → ${TARGET_STATUS}`);
        console.log(`             comment: ${ACCEPTANCE_COMMENT}`);
        return 'sent';
    }

    try {
        const info = await mailer.sendMail({
            // MAIL_USER is no-reply@; Mailcow rejects From addresses not owned by that user
            from: '"B-Side Festival" <no-reply@b-side.ms>',
            replyTo: 'festival@b-side.ms',
            to: participant.contactMail,
            subject,
            html,
        });

        if (info.accepted.length === 0) {
            throw new Error('Accepted list is empty');
        }

        await prisma.$transaction(async (tx) => {
            await tx.participantLabel.deleteMany({ where: { participantId: id } });
            await tx.participant.update({
                where: { id },
                data: { status: TARGET_STATUS },
            });
            await tx.comment.create({
                data: {
                    authorName: SYSTEM_AUTHOR_NAME,
                    authorUserId: SYSTEM_AUTHOR_USER_ID,
                    participantId: id,
                    statusTransition: TARGET_STATUS,
                    text: ACCEPTANCE_COMMENT,
                },
            });
        });

        console.log(`[SENT]       ${displayActName(participant)} (ID ${id}) → ${participant.contactMail} [${form}]`);
        return 'sent';
    } catch (error) {
        console.error(`[ERROR]      ${displayActName(participant)} (ID ${id}): ${error instanceof Error ? error.message : String(error)}`);
        return 'failed';
    }
};

const main = async () => {
    const { mode, ids } = parseArgs(process.argv);
    const prisma = createPrisma();

    try {
        if (mode === 'list') {
            const eligible = await listEligible(prisma);
            console.log(`Eligible for Ausstellung-Zusagemail: ${eligible.length}\n`);
            console.log('  id | form     | fee | n | act | mail | slot');
            for (const participant of eligible) {
                printEligibleRow(participant);
            }
            if (eligible.length > 0) {
                console.log(`\nIDs: ${eligible.map((participant) => participant.id).join(',')}`);
            }
            return;
        }

        console.log(`Processing ${ids.length} exhibition(s)${mode === 'dry-run' ? ' (dry-run)' : ''}…\n`);
        const mailer = createMailer();

        let sent = 0;
        let skipped = 0;
        let failed = 0;

        for (const id of ids) {
            const result = await processParticipant(prisma, mailer, id, mode === 'dry-run');
            if (result === 'sent') {
                sent++;
            } else if (result === 'skipped') {
                skipped++;
            } else {
                failed++;
            }
        }

        console.log(`\nDone — ${mode === 'dry-run' ? 'previewed' : 'sent'}: ${sent}, skipped: ${skipped}, failed: ${failed}`);
    } finally {
        await prisma.$disconnect();
    }
};

main().catch((error) => {
    console.error('Fatal:', error);
    process.exit(1);
});
