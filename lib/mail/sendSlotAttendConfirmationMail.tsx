import formatDate from '@/lib/common/helper/formatDate';
import createMailHtml from '@/lib/mail/createMailHtml';
import sendMail from '@/lib/mail/sendMail';
import type { Location, Participant, Slot } from '@prisma/client';

const generateAttendContent = (participant: Participant, slot: Slot, location: Location, fullName: string) => {
    return `
        <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 20px;">
            Schön, dass du dich für den Programmpunkt ${participant.name} angemeldet hast.
        </p>
        
        <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 0 20px;">
            Du hast dich als ${fullName} angemeldet. ${participant.name} findet am
            ${formatDate(slot.begin, "EEEE, dd.MM. 'um' HH:mm 'Uhr'")} am Ort <i>${location.name}</i> statt.
            Komm bitte pünktlich!
        </p>
        
        <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 0 20px;">
            Solltest du nicht mehr teilnehmen können, informiere uns bitte über festival@b-side.ms.
        </p>
        
        <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 0 20px;">
            Wir freuen uns auf dich!
        </p>
  `;
};

const sendSlotAttendConfirmationMail = (
    participant: Participant,
    slot: Slot,
    location: Location,
    fullName: string,
    mailAddress: string,
): void => {
    const title = 'B-Side Festival 2025 - Anmeldebestätigung';
    const content = generateAttendContent(participant, slot, location, fullName);
    const html = createMailHtml(content);

    sendMail(title, mailAddress, html);
};

export default sendSlotAttendConfirmationMail;
