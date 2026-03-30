import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import createMailHtml from '@/lib/mail/createMailHtml';
import sendMail from '@/lib/mail/sendMail';
import typeLabels from '@/lib/participants/typeLabels';
import type { Participant } from '@prisma/client';
import prisma from '../common/prismaClient';

const generateApplicationContent = async (
    application: Participant,
    token: string
): Promise<string> => {
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
        residence,
        technicalRider,
        technicalRiderFileName,
        backlineSharing,
        participantCount,
        hasMarginalizedParticipants,
        diversityNotes,
        allergies
    } = application;

    const links = await prisma.link.findMany({
        where: {
            participantId: id
        }
    });
    const publicLinks = links.filter((l) => !l.isConfidential).map((l) => l.link);
    const privateLinks = links.filter((l) => l.isConfidential).map((l) => l.link);

    const sections = [
        `<strong>Typ:</strong><br>${typeLabels[type]}`,
        `<strong>Name:</strong><br>${name}`,
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
        isNotEmptyString(residence) && `<strong>Wohnort:</strong><br>${residence}`,
    ].filter(Boolean);

    const formatParticipantId = `2026-${id.toString().padStart(5, '0')}`;       

    return `
    <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 20px;">Vielen Dank für eure Bewerbung und euer Interesse, Teil des diesjährigen B-Side Festivals zu sein.</p>
    <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 20px;">Bitte bestätige deine E-Mail Adresse unter folgendem Link: <a href="${process.env.APP_URL}/bewerbungen/confirm/${token}" style="color: #000; text-decoration: underline;">Bestätigen</a></p>
    <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 20px;">Bei Fragen zur Bewerbung können ihr euch per Mail an uns wenden unter festival@b-side.ms mit eurer Bewerbernummer im Betreff "${formatParticipantId}". Bitte versucht nicht uns bezüglich Festival-Orga über Social Media zu erreichen - E-Mail ist der Weg. Der Eine. Wenn wir nicht antworten haben die ehrenamtlichen Mitarbeiter keine Zeit gefunden. Wir bitten um Verständniss</p>
</p>

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

const sendApplicationConfirmationMail = async (
    application: Participant,
    token: string
): Promise<void> => {
    const title = 'B-Side Festival 2026 - Bewerbungsbestätigung';
    const content = await generateApplicationContent(application, token);
    const html = createMailHtml(content);

    await sendMail(title, application.contactMail, html);
};

export default sendApplicationConfirmationMail;
