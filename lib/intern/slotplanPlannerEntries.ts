import { ApplicationStatus, ScheduleEntryKind } from '@prisma/client';
import { filter } from 'lodash';
import type { SerializableParticipant } from '../../typings/SerializableParticipant';
import type { SerializableScheduleEntry } from '../../typings/SerializableScheduleEntry';

export const filterSlotplanPlannerEntries = (
    entries: Array<SerializableScheduleEntry>,
    participants: Array<Pick<SerializableParticipant, 'id' | 'status'>>,
    confirmedOnly: boolean,
    hideNotes: boolean,
): Array<SerializableScheduleEntry> => {
    const confirmedIds = new Set(participants.filter(({ status }) => status === ApplicationStatus.Confirmed).map(({ id }) => id));

    return filter(entries, (entry) => {
        if (entry.kind === ScheduleEntryKind.ScheduleNote) {
            return !hideNotes;
        }

        if (!confirmedOnly) {
            return true;
        }

        return entry.participantId !== null && confirmedIds.has(entry.participantId);
    });
};
