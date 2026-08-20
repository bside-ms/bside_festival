import createMailHtml, { mailButtonStyle, mailParagraphStyle } from '@/lib/mail/createMailHtml';
import { escapeHtml } from '@/lib/mail/escapeHtml';
import sendMail from '@/lib/mail/sendMail';
import type { Volunteer } from '@prisma/client';

const generateConfirmationContent = (volunteer: Volunteer, token: string): string => {
    const confirmUrl = `${process.env.APP_URL}/mithelfen/confirm/${token}`;

    return `
    <p style="${mailParagraphStyle}"><strong>Hallo ${escapeHtml(volunteer.fullName)},</strong></p>
    <p style="${mailParagraphStyle}">schön, dass du beim B-Side Festival als Helfer*in mitmachen möchtest!</p>
    <p style="${mailParagraphStyle}">Bitte bestätige einmalig deine E-Mail-Adresse:</p>
    <p style="${mailParagraphStyle}">
      <a href="${confirmUrl}" style="${mailButtonStyle}">E-Mail bestätigen</a>
    </p>
    <p style="${mailParagraphStyle}">Der Link ist drei Tage gültig.</p>
    <p style="${mailParagraphStyle}">Herzliche Grüße<br>das Festival-Team</p>
  `;
};

const sendVolunteerConfirmationMail = async (volunteer: Volunteer, token: string): Promise<void> => {
    const title = 'B-Side Festival 2026 – bitte E-Mail bestätigen';
    const html = createMailHtml(generateConfirmationContent(volunteer, token));

    await sendMail(title, volunteer.mailAddress, html);
};

export default sendVolunteerConfirmationMail;
