import formatDate from '@/lib/common/helper/formatDate';
import createMailHtml, { mailButtonStyle, mailParagraphStyle } from '@/lib/mail/createMailHtml';
import { escapeHtml } from '@/lib/mail/escapeHtml';
import sendMail from '@/lib/mail/sendMail';
import type { Attendee, Participant, ProgramLocation, ScheduleEntry } from '@prisma/client';

const sendWorkshopAttendanceConfirmationMail = async (
    attendee: Attendee,
    participant: Participant,
    scheduleEntry: ScheduleEntry,
    programLocation: ProgramLocation,
    cancellationToken: string,
): Promise<void> => {
    const cancellationUrl = `${process.env.APP_URL}/programm/anmeldung/abmelden/${cancellationToken}`;
    const content = `
        <p style="${mailParagraphStyle}"><strong>Hallo ${escapeHtml(attendee.fullName)},</strong></p>
        <p style="${mailParagraphStyle}">deine Teilnahme am Workshop „${escapeHtml(participant.name)}“ ist bestätigt.</p>
        <p style="${mailParagraphStyle}">
            Der Workshop findet am ${formatDate(scheduleEntry.startsAt!, "EEEE, dd.MM. 'um' HH:mm 'Uhr'")} im ${escapeHtml(programLocation.name)} statt.
        </p>
        <p style="${mailParagraphStyle}"><strong>Bitte sei pünktlich da, damit der Workshop für alle gut beginnen kann.</strong></p>
        <p style="${mailParagraphStyle}"><strong>Bitte melde dich unbedingt wieder ab, falls du nicht teilnehmen kannst. Die Plätze sind begrenzt und können dann an andere Menschen gehen.</strong></p>
        <p style="${mailParagraphStyle}"><a href="${cancellationUrl}" style="${mailButtonStyle}">Teilnahme abmelden</a></p>
        <p style="${mailParagraphStyle}">Herzliche Grüße<br>das Festival-Team</p>
    `;

    await sendMail('B-Side Festival 2026 – Workshop-Teilnahme bestätigt', attendee.mailAddress, createMailHtml(content));
};

export default sendWorkshopAttendanceConfirmationMail;
