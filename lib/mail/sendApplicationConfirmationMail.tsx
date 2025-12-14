import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import createMailHtml from '@/lib/mail/createMailHtml';
import sendMail from '@/lib/mail/sendMail';
import typeLabels from '@/lib/participants/typeLabels';
import type { Participant } from '@prisma/client';

const generateApplicationContent = (
    application: Omit<Participant, 'contactMail'> & { contactMail: string },
    links: Array<string>,
): string => {
    const {
        type,
        description,
        name,
        motivation,
        additionalInfo,
        contactMail,
        contactName,
        contactPhone,
        address,
        residence,
        technicalRider,
        technicalRiderFileName,
        backlineSharing,
        materialExpenses,
        participantCount,
        hasFlintaParticipants,
        hasMarginalizedParticipants,
        diversityNotes,
        allergies,
    } = application;

    const sections = [
        `<strong>Typ:</strong><br>${typeLabels[type]}`,
        `<strong>Name:</strong><br>${name}`,
        isNotEmptyString(description) && `<strong>Beschreibung:</strong><br>${description}`,
        isNotEmptyString(participantCount) && `<strong>Personenanzahl:</strong><br>${participantCount}`,
        hasFlintaParticipants && `<strong>FLINTA* Personen:</strong><br>ja`,
        hasMarginalizedParticipants && `<strong>Personen marginalisierter Gruppen:</strong><br>ja`,
        isNotEmptyString(diversityNotes) && `<strong>Diversität:</strong><br>${diversityNotes}`,
        isNotEmptyString(allergies) && `<strong>Allergien:</strong><br>${allergies}`,
        isNotEmptyString(motivation) && `<strong>Motivation:</strong><br>${motivation}`,
        isNotEmptyString(additionalInfo) && `<strong>Zusätzliche Info:</strong><br>${additionalInfo}`,
        (isNotEmptyString(technicalRider) || isNotEmptyString(technicalRiderFileName)) &&
            `<strong>Technical Rider:</strong><br>${technicalRider ?? ''}<br>${technicalRiderFileName ? '(PDF bereitgestellt)' : ''}`,
        isNotEmptyString(backlineSharing) && `<strong>Backline-Sharing:</strong><br>${backlineSharing}`,
        isNotEmptyString(materialExpenses) && `<strong>Materialkosten:</strong><br>${materialExpenses}`,
        links.length > 0 && `<strong>Links:</strong><br>${links.map((l) => `${l}`).join('<br>')}`,
        isNotEmptyString(contactName) && `<strong>Ansprechperson:</strong><br>${contactName}`,
        isNotEmptyString(contactMail) && `<strong>E-Mail-Adresse:</strong><br>${contactMail}`,
        isNotEmptyString(contactPhone) && `<strong>Telefonnummer:</strong><br>${contactPhone}`,
        isNotEmptyString(address) && `<strong>Adresse:</strong><br>${address}`,
        isNotEmptyString(residence) && `<strong>Wohnort:</strong><br>${residence}`,
    ].filter(Boolean);

    return `
    <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 20px;">Vielen Dank für eure Bewerbung und euer Interesse, Teil des diesjährigen B-Side Festivals zu sein.</p>

    <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 0 20px;">
      Hier eine kurze Zusammenfassung eurer Bewerbung:
      <br><br>
      ${sections.map((section) => `<p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 0 20px;">${section}</p>`).join('<br/>')}
    </p>

    <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 0 20px;">
      Zusammen mit den vielen anderen Bewerbungen werden wir diese bald sichten und uns im Anschluss bei euch melden!
    </p>
  `;
};

const sendApplicationConfirmationMail = (
    application: Omit<Participant, 'contactMail'> & { contactMail: string },
    links: Array<string>,
): void => {
    const title = 'B-Side Festival 2025 - Bewerbungsbestätigung';
    const content = generateApplicationContent(application, links);
    const html = createMailHtml(content);

    sendMail(title, application.contactMail, html);
};

export default sendApplicationConfirmationMail;
