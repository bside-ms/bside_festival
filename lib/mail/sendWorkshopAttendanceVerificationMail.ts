import createMailHtml, { mailButtonStyle, mailParagraphStyle } from '@/lib/mail/createMailHtml';
import { escapeHtml } from '@/lib/mail/escapeHtml';
import sendMail from '@/lib/mail/sendMail';
import type { Attendee, Participant } from '@prisma/client';

const sendWorkshopAttendanceVerificationMail = async (attendee: Attendee, participant: Participant, token: string): Promise<void> => {
    const confirmationUrl = `${process.env.APP_URL}/programm/anmeldung/bestaetigen/${token}/ausfuehren`;
    const content = `
        <p style="${mailParagraphStyle}"><strong>Hallo ${escapeHtml(attendee.fullName)},</strong></p>
        <p style="${mailParagraphStyle}">du hast einen Platz für den Workshop „${escapeHtml(participant.name)}“ reserviert.</p>
        <p style="${mailParagraphStyle}">Bitte bestätige deine E-Mail-Adresse innerhalb von 24 Stunden, damit die Teilnahme verbindlich wird:</p>
        <p style="${mailParagraphStyle}"><a href="${confirmationUrl}" style="${mailButtonStyle}">Teilnahme bestätigen</a></p>
        <p style="${mailParagraphStyle}">Ohne Bestätigung wird die Reservierung automatisch aufgehoben und der Platz wieder freigegeben.</p>
        <p style="${mailParagraphStyle}">Herzliche Grüße<br>das Festival-Team</p>
    `;

    await sendMail('B-Side Festival 2026 – bitte Workshop-Teilnahme bestätigen', attendee.mailAddress, createMailHtml(content));
};

export default sendWorkshopAttendanceVerificationMail;
