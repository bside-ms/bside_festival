import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import createMailHtml, { mailButtonStyle, mailLinkStyle, mailParagraphStyle } from '@/lib/mail/createMailHtml';
import { escapeHtml } from '@/lib/mail/escapeHtml';
import sendMail from '@/lib/mail/sendMail';
import typeLabels from '@/lib/participants/typeLabels';
import type { Participant } from '@prisma/client';
import prisma from '../common/prismaClient';

const generateApplicationContent = async (application: Participant, token: string): Promise<string> => {
    const {
        id,
        type,
        description,
        name,
        motivation,
        additionalInfo,
        contactMail,
        contactName,
        contactPhone,
        address,
        technicalRider,
        technicalRiderFileName,
        backlineSharing,
        participantCount,
        hasMarginalizedParticipants,
        diversityNotes,
        allergies,
    } = application;

    const links = await prisma.link.findMany({
        where: {
            participantId: id,
        },
    });
    const publicLinks = links.filter((l) => !l.isConfidential).map((l) => l.link);
    const privateLinks = links.filter((l) => l.isConfidential).map((l) => l.link);

    const sections = [
        `<strong>Typ:</strong><br>${escapeHtml(typeLabels[type])}`,
        `<strong>Name:</strong><br>${escapeHtml(name)}`,
        isNotEmptyString(description) && `<strong>Beschreibung:</strong><br>${description}`,
        `<strong>Personenanzahl:</strong><br>${participantCount}`,
        hasMarginalizedParticipants && `<strong>Personen marginalisierter Gruppen:</strong><br>ja`,
        isNotEmptyString(diversityNotes) && `<strong>Diversität:</strong><br>${diversityNotes}`,
        isNotEmptyString(allergies) && `<strong>Allergien:</strong><br>${allergies}`,
        isNotEmptyString(motivation) && `<strong>Motivation:</strong><br>${motivation}`,
        isNotEmptyString(additionalInfo) && `<strong>Zusätzliche Info:</strong><br>${additionalInfo}`,
        (isNotEmptyString(technicalRider) || isNotEmptyString(technicalRiderFileName)) &&
            `<strong>Technical Rider:</strong><br>${technicalRider ?? ''}<br>${technicalRiderFileName ? '(PDF bereitgestellt)' : ''}`,
        isNotEmptyString(backlineSharing) && `<strong>Backline-Sharing:</strong><br>${backlineSharing}`,
        publicLinks.length > 0 && `<strong>öffentliche Links:</strong><br>${publicLinks.map((l) => `${l}`).join('<br>')}`,
        privateLinks.length > 0 && `<strong>private Links:</strong><br>${privateLinks.map((l) => `${l}`).join('<br>')}`,
        isNotEmptyString(contactName) && `<strong>Ansprechperson:</strong><br>${contactName}`,
        isNotEmptyString(contactMail) && `<strong>E-Mail-Adresse:</strong><br>${contactMail}`,
        isNotEmptyString(contactPhone) && `<strong>Telefonnummer:</strong><br>${contactPhone}`,
        isNotEmptyString(address) && `<strong>Adresse:</strong><br>${address}`,
    ].filter(Boolean);

    return `
    <p style="${mailParagraphStyle}">Vielen Dank für eure Bewerbung und euer Interesse, Teil des diesjährigen B-Side Festivals zu sein.</p>
    <p style="${mailParagraphStyle}">Bitte bestätige deine E-Mail-Adresse:</p>
    <p style="${mailParagraphStyle}">
      <a href="${process.env.APP_URL}/bewerbungen/confirm/${token}" style="${mailButtonStyle}">E-Mail bestätigen</a>
    </p>
    <p style="${mailParagraphStyle}">Bei Fragen zur Bewerbung könnt ihr euch per Mail an uns wenden unter <a href="mailto:festival@b-side.ms" style="${mailLinkStyle}">festival@b-side.ms</a> mit eurem Projektnamen im Betreff. Bitte habt Verständnis, dass das Festival von ehrenamtlichen Mitarbeiter*innen organisiert wird und wir daher ggf. ein paar Tage für eine Antwort brauchen.</p>
    <p style="${mailParagraphStyle}">Hier eine kurze Zusammenfassung eurer Bewerbung:</p>
    ${sections.map((section) => `<p style="${mailParagraphStyle}">${section}</p>`).join('')}
    <p style="${mailParagraphStyle}">Zusammen mit den vielen anderen Bewerbungen werden wir diese bald sichten und uns im Anschluss bei euch melden!</p>
  `;
};

const sendApplicationConfirmationMail = async (application: Participant, token: string): Promise<void> => {
    const title = 'B-Side Festival 2026 - Bewerbungsbestätigung';
    const content = await generateApplicationContent(application, token);
    const html = createMailHtml(content);

    await sendMail(title, application.contactMail, html);
};

export default sendApplicationConfirmationMail;
