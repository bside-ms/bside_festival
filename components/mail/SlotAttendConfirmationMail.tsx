import MailParagraph from '@/components/mail/MailParagraph';
import MailWireframe from '@/components/mail/MailWireframe';
import formatDate from '@/lib/common/helper/formatDate';
import type { Location, Participant, Slot } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    title: string;
    fullName: string;
    slot: Slot;
    participant: Participant;
    location: Location;
}

const SlotAttendConfirmationMail = ({ slot, title, fullName, participant, location }: Props): ReactElement => {
    return (
        <MailWireframe title={title}>
            <MailParagraph>Hey {fullName},</MailParagraph>

            <MailParagraph>
                du hast dich erfolgreich für die Veranstaltung <strong>{participant.updatedName ?? participant.name}</strong> angemeldet.
            </MailParagraph>

            <MailParagraph>
                Diese beginnt am {formatDate(slot.begin, "EEEE, dd.MM. 'um' HH:mm 'Uhr'")} ({location.name}). Sei bitte pünktlich vor Ort.
            </MailParagraph>

            <MailParagraph>Solltest du nicht mehr teilnehmen können, informiere uns bitte über festival@b-side.ms.</MailParagraph>

            <MailParagraph>Wir freuen uns auf dich!</MailParagraph>
        </MailWireframe>
    );
};

export default SlotAttendConfirmationMail;
