import formatDate from '@/lib/common/helper/formatDate';
import createMailHtml from '@/lib/mail/createMailHtml';
import sendMail from '@/lib/mail/sendMail';
import type { Participant, ProgramLocation, ScheduleEntry } from '@prisma/client';

const generateAttendContent = (
    participant: Participant,
    scheduleEntry: ScheduleEntry,
    programLocation: ProgramLocation,
    fullName: string,
) => {
    return `
        <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 20px;">
            Schön, dass du dich für den Programmpunkt ${participant.name} angemeldet hast.
        </p>
        
        <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000; padding: 0 20px;">
            Du hast dich als ${fullName} angemeldet. ${participant.name} findet am
            ${formatDate(scheduleEntry.startsAt!, "EEEE, dd.MM. 'um' HH:mm 'Uhr'")} am Ort <i>${programLocation.name}</i> statt.
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
    scheduleEntry: ScheduleEntry,
    programLocation: ProgramLocation,
    fullName: string,
    mailAddress: string,
): void => {
    const title = 'B-Side Festival 2026 - Anmeldebestätigung';
    const content = generateAttendContent(participant, scheduleEntry, programLocation, fullName);
    const html = createMailHtml(content);

    sendMail(title, mailAddress, html);
};

export default sendSlotAttendConfirmationMail;
