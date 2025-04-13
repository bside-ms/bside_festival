import { render } from '@faire/mjml-react/utils/render';
import SlotAttendConfirmationMail from 'components/mail/SlotAttendConfirmationMail';
import type { Location, Participant, Slot } from '@prisma/client';
import sendMail from 'lib/mail/sendMail';

const sendSlotAttendConfirmationMail = (
    participant: Participant,
    slot: Slot,
    location: Location,
    fullName: string,
    mailAddress: string,
): void => {
    const title = 'B-Side Festival 2025 - Anmeldebestätigung';

    sendMail(
        title,
        mailAddress,
        render(<SlotAttendConfirmationMail title={title} fullName={fullName} slot={slot} participant={participant} location={location} />),
    );
};

export default sendSlotAttendConfirmationMail;
