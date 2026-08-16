import { ScheduleEntryKind, ScheduleEntryTimeMode } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import type { SerializableScheduleEntry } from '../../typings/SerializableScheduleEntry';
import { getSlotplanDisplayWindow } from './slotplanDisplayWindow';

const friday = {
    endsAt: new Date('2026-09-19T03:00:00+02:00'),
    label: 'Freitag',
    startsAt: new Date('2026-09-18T12:00:00+02:00'),
};

const entry = (
    overrides: Partial<SerializableScheduleEntry> & Pick<SerializableScheduleEntry, 'id' | 'startsAt' | 'endsAt'>,
): SerializableScheduleEntry => ({
    allDayDates: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    isBlocking: true,
    isPublic: false,
    kind: ScheduleEntryKind.Participant,
    maxAttendees: null,
    participantId: overrides.id,
    programLocationId: 1,
    timeMode: ScheduleEntryTimeMode.Timed,
    title: null,
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
});

describe('getSlotplanDisplayWindow', () => {
    it('keeps the festival day when there are no timed entries', () => {
        expect(getSlotplanDisplayWindow([], friday)).toEqual(friday);
        expect(
            getSlotplanDisplayWindow(
                [
                    entry({
                        id: 1,
                        allDayDates: ['2026-09-18'],
                        endsAt: null,
                        startsAt: null,
                        timeMode: ScheduleEntryTimeMode.AllDay,
                    }),
                ],
                friday,
            ),
        ).toEqual(friday);
    });

    it('starts one hour before the first slot and ends one hour after the last', () => {
        expect(
            getSlotplanDisplayWindow(
                [
                    entry({ id: 1, startsAt: '2026-09-18T16:00:00+02:00', endsAt: '2026-09-18T17:00:00+02:00' }),
                    entry({ id: 2, startsAt: '2026-09-18T20:30:00+02:00', endsAt: '2026-09-18T22:00:00+02:00' }),
                ],
                friday,
            ),
        ).toEqual({
            ...friday,
            startsAt: new Date('2026-09-18T15:00:00+02:00'),
            endsAt: new Date('2026-09-18T23:00:00+02:00'),
        });
    });
});
