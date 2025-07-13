import sendMail from '@/lib/mail/sendMail';
import type { Location, Participant, Slot } from '@prisma/client';

const sendSlotAttendConfirmationMail = (
    participant: Participant,
    slot: Slot,
    location: Location,
    fullName: string,
    mailAddress: string,
): void => {
    const title = 'B-Side Festival 2025 - Anmeldebestätigung';

    sendMail(title, mailAddress, { html: '<div>todo</div>' });
};

export default sendSlotAttendConfirmationMail;
