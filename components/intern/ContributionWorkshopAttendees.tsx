'use client';

import WorkshopAttendeeList, { type WorkshopAttendeeListEntry } from '@/components/participants/attendeeForm/WorkshopAttendeeList';
import formatDate from '@/lib/common/helper/formatDate';
import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import type { ReactElement } from 'react';

export interface ContributionWorkshopAttendee extends WorkshopAttendeeListEntry {
    scheduleEntryId: number;
}

interface Props {
    attendees: Array<ContributionWorkshopAttendee>;
    isInDataPrivacyGroup: boolean;
    participantId: number;
    scheduleEntries: Array<SerializableScheduleEntry>;
}

const ContributionWorkshopAttendees = ({ attendees, isInDataPrivacyGroup, participantId, scheduleEntries }: Props): ReactElement | null => {
    const workshopEntries = scheduleEntries.filter((entry) => entry.maxAttendees !== null);

    if (workshopEntries.length === 0) {
        return null;
    }

    return (
        <div className="space-y-5">
            <div className="font-display text-xl">Workshop-Teilnehmende</div>
            {workshopEntries.map((entry) => (
                <section key={entry.id} className="rounded border border-black bg-white p-3">
                    <div className="font-bold">
                        {entry.startsAt === null ? 'Zeit folgt' : formatDate(new Date(entry.startsAt), "EEEE, dd.MM. 'um' HH:mm 'Uhr'")}
                    </div>
                    <WorkshopAttendeeList
                        allowRemoval={true}
                        attendees={attendees.filter((attendee) => attendee.scheduleEntryId === entry.id)}
                        isInDataPrivacyGroup={isInDataPrivacyGroup}
                        participantId={participantId}
                        scheduleEntryId={entry.id}
                        showMessages={true}
                    />
                </section>
            ))}
        </div>
    );
};

export default ContributionWorkshopAttendees;
