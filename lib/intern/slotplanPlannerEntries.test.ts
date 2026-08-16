import { ApplicationStatus, ScheduleEntryKind, ScheduleEntryTimeMode } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import type { SerializableScheduleEntry } from '../../typings/SerializableScheduleEntry';
import { filterSlotplanPlannerEntries } from './slotplanPlannerEntries';

const entry = (
    overrides: Partial<SerializableScheduleEntry> & Pick<SerializableScheduleEntry, 'id' | 'kind'>,
): SerializableScheduleEntry => ({
    allDayDates: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    endsAt: '2026-09-18T19:00:00+02:00',
    isBlocking: true,
    isPublic: false,
    maxAttendees: null,
    participantId: overrides.kind === ScheduleEntryKind.Participant ? overrides.id : null,
    programLocationId: 1,
    startsAt: '2026-09-18T18:00:00+02:00',
    timeMode: ScheduleEntryTimeMode.Timed,
    title: null,
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
});

const participants = [
    { id: 1, status: ApplicationStatus.Confirmed },
    { id: 2, status: ApplicationStatus.WaitingForConfirmation },
];

describe('filterSlotplanPlannerEntries', () => {
    const confirmed = entry({ id: 1, kind: ScheduleEntryKind.Participant });
    const unconfirmed = entry({ id: 2, kind: ScheduleEntryKind.Participant });
    const note = entry({ id: 3, kind: ScheduleEntryKind.ScheduleNote, title: 'Umbau' });

    it('keeps every entry when both filters are off', () => {
        expect(filterSlotplanPlannerEntries([confirmed, unconfirmed, note], participants, false, false)).toEqual([
            confirmed,
            unconfirmed,
            note,
        ]);
    });

    it('hides unconfirmed acts and keeps notes', () => {
        expect(filterSlotplanPlannerEntries([confirmed, unconfirmed, note], participants, true, false)).toEqual([confirmed, note]);
    });

    it('hides notes and keeps unconfirmed acts', () => {
        expect(filterSlotplanPlannerEntries([confirmed, unconfirmed, note], participants, false, true)).toEqual([confirmed, unconfirmed]);
    });

    it('applies both filters independently', () => {
        expect(filterSlotplanPlannerEntries([confirmed, unconfirmed, note], participants, true, true)).toEqual([confirmed]);
    });
});
