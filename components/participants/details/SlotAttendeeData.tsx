import { useParticipantsOverviewContext, useScheduleEntryAttendees } from '@/components/participants/overview/ParticipantsOverviewContext';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import { ReactElement } from 'react';

interface Props {
    scheduleEntry: SerializableScheduleEntry;
}

const SlotAttendeeData = ({ scheduleEntry: { id: scheduleEntryId, maxAttendees } }: Props): ReactElement => {
    const { isInDataPrivacyGroup } = useParticipantsOverviewContext();

    const slotAttendees = useScheduleEntryAttendees(scheduleEntryId);

    return (
        <div>
            <div className="font-display">Anmeldungen</div>

            <div className="mt-1">
                {slotAttendees.length} von {maxAttendees} Plätzen belegt
            </div>

            {slotAttendees.length > 0 && (
                <ul className="mt-2 list-outside list-disc pl-4">
                    {slotAttendees.map(({ id, fullName, mailAddress }) => (
                        <li key={id}>
                            <span>{fullName}</span>
                            {isNotEmptyString(mailAddress) && <span className="ml-2">({mailAddress})</span>}
                        </li>
                    ))}
                </ul>
            )}

            {!isInDataPrivacyGroup && (
                <div className="mt-1 text-sm text-gray-700">
                    Mitglieder der Datenschutz-Gruppe können die E-Mail-Adressen der Teilnehmer:innen einsehen
                </div>
            )}
        </div>
    );
};

export default SlotAttendeeData;
