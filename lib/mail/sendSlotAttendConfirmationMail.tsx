import formatDate from '@/lib/common/helper/formatDate';
import createMailHtml, { mailLinkStyle, mailParagraphStyle } from '@/lib/mail/createMailHtml';
import { escapeHtml } from '@/lib/mail/escapeHtml';
import sendMail from '@/lib/mail/sendMail';
import type { Participant, ProgramLocation, ScheduleEntry } from '@prisma/client';

const generateAttendContent = (
    participant: Participant,
    scheduleEntry: ScheduleEntry,
    programLocation: ProgramLocation,
    fullName: string,
): string => {
    return `
        <p style="${mailParagraphStyle}">Schön, dass du dich für den Programmpunkt ${escapeHtml(participant.name)} angemeldet hast.</p>
        <p style="${mailParagraphStyle}">
            Du hast dich als ${escapeHtml(fullName)} angemeldet. ${escapeHtml(participant.name)} findet am
            ${formatDate(scheduleEntry.startsAt!, "EEEE, dd.MM. 'um' HH:mm 'Uhr'")} am Ort <i>${escapeHtml(programLocation.name)}</i> statt.
            Komm bitte pünktlich!
        </p>
        <p style="${mailParagraphStyle}">
            Solltest du nicht mehr teilnehmen können, informiere uns bitte über
            <a href="mailto:festival@b-side.ms" style="${mailLinkStyle}">festival@b-side.ms</a>.
        </p>
        <p style="${mailParagraphStyle}">Wir freuen uns auf dich!</p>
  `;
};

const sendSlotAttendConfirmationMail = (
    participant: Participant,
    scheduleEntry: ScheduleEntry,
    programLocation: ProgramLocation,
    fullName: string,
    mailAddress: string,
): void => {
    const title = 'B-Side Festival 2026 - Anmeldebestätigung';
    const content = generateAttendContent(participant, scheduleEntry, programLocation, fullName);
    const html = createMailHtml(content);

    sendMail(title, mailAddress, html);
};

export default sendSlotAttendConfirmationMail;
