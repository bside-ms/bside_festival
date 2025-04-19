import type { Participant } from '@prisma/client';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import sendMail from 'lib/mail/sendMail';
import typeLabels from 'lib/participants/typeLabels';

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

const htmlTemplate = (content: string): string => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>B-Side Festival 2025</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f57773; }
    table { border-spacing: 0; border-collapse: collapse; }
    .email-wrapper { width: 100%; background-color: #f57773; }
    .email-container {
      width: 600px;
      margin: 20px auto;
      background-color: #e9e9e9;
      border-radius: 4px;
      padding: 20px;
      font-family: "Ubuntu", sans-serif;
      font-size: 16px;
      color: #000;
      line-height: 1.5;
    }
    .header {
      background-color: #818387;
      color: #ededed;
      font-weight: 700;
      font-size: 20px;
      padding: 20px 15px;
      text-align: left;
      font-family: "Ubuntu", sans-serif;
    }
    .footer-text {
      color: #4d5c6b;
      font-size: 12px;
      margin: 20px;
    }
    .divider {
      border-top: 1px solid #374151;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <center class="email-wrapper">
    <table width="100%" class="header"><tr><td width="600" style="font-family: sans-serif; padding: 30px;">B-Side Festival 2025</td></tr></table>
    <table width="100%" class="email-container"><tr><td>
      ${content}
      <div class="divider"></div>
      <p class="footer-text">
        Diese E-Mail wurde automatisch generiert, bitte antworten Sie nicht auf sie. Verwende dafür stattdessen
        <a href="mailto:festival@b-side.ms" style="color: #4d5c6b;">festival@b-side.ms</a>.
      </p>
    </td></tr></table>
  </center>
</body>
</html>
`;

const sendApplicationConfirmationMail = (
    application: Omit<Participant, 'contactMail'> & { contactMail: string },
    links: Array<string>,
): void => {
    const title = 'B-Side Festival 2025 - Bewerbungsbestätigung';
    const content = generateApplicationContent(application, links);
    const html = htmlTemplate(content);

    sendMail(title, application.contactMail, { html });
};

export default sendApplicationConfirmationMail;
