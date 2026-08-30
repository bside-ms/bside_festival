import createMailHtml, { mailParagraphStyle } from '@/lib/mail/createMailHtml';
import { escapeHtml } from '@/lib/mail/escapeHtml';
import sendMail from '@/lib/mail/sendMail';
import type { Attendee, Participant } from '@prisma/client';

const sendWorkshopAttendanceCancellationMail = async (attendee: Attendee, participant: Participant): Promise<void> => {
    const content = `
        <p style="${mailParagraphStyle}"><strong>Hallo ${escapeHtml(attendee.fullName)},</strong></p>
        <p style="${mailParagraphStyle}">deine Teilnahme am Workshop „${escapeHtml(participant.name)}“ wurde abgemeldet. Der Platz ist wieder frei.</p>
        <p style="${mailParagraphStyle}">Herzliche Grüße<br>das Festival-Team</p>
    `;

    await sendMail('B-Side Festival 2026 – Workshop-Teilnahme abgemeldet', attendee.mailAddress, createMailHtml(content));
};

export default sendWorkshopAttendanceCancellationMail;
