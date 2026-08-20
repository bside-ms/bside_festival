import createMailHtml, { mailLinkStyle, mailParagraphStyle } from '@/lib/mail/createMailHtml';
import { escapeHtml } from '@/lib/mail/escapeHtml';
import sendMail from '@/lib/mail/sendMail';
import type { Volunteer } from '@prisma/client';

const generateWelcomeContent = (volunteer: Volunteer): string => `
    <p style="${mailParagraphStyle}"><strong>Hallo ${escapeHtml(volunteer.fullName)},</strong></p>
    <p style="${mailParagraphStyle}">vielen Dank, du bist jetzt als Helfer*in für das B-Side Festival registriert.</p>
    <p style="${mailParagraphStyle}">Sobald die Schichtpläne für Freitag und Samstag stehen, bekommst du eine Mail und kannst dich im Planungstool verbindlich für Schichten eintragen.</p>
    <p style="${mailParagraphStyle}">Ungefähr zwei Wochen vor dem Festival gibt es ein Helfer*innen-Treffen. Dort klären wir offene Fragen und geben eine kurze Einarbeitung in die B-Side, das Festival und die einzelnen Aufgabenbereiche.</p>
    <p style="${mailParagraphStyle}">Zur schnellen Abstimmung während des Festivals gibt es eine Telegram-Gruppe. Dort landen kurzfristige Infos und Änderungen.</p>
    <p style="${mailParagraphStyle}">Bei Fragen erreichst du uns unter <a href="mailto:festival@b-side.ms" style="${mailLinkStyle}">festival@b-side.ms</a>.</p>
    <p style="${mailParagraphStyle}">Wir freuen uns auf dich!<br>das Festival-Team</p>
  `;

const sendVolunteerWelcomeMail = async (volunteer: Volunteer): Promise<void> => {
    const title = 'B-Side Festival 2026 – du bist als Helfer*in dabei';
    const html = createMailHtml(generateWelcomeContent(volunteer));

    await sendMail(title, volunteer.mailAddress, html);
};

export default sendVolunteerWelcomeMail;
