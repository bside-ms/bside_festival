import { ScheduleEntryKind, ScheduleEntryTimeMode } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import type { SerializableScheduleEntry } from '../../typings/SerializableScheduleEntry';
import { buildSlotplanOverlapLayout, getSlotplanLocationColumnWidthPx, getSlotplanLocationColumnWidthsPx } from './slotplanOverlapLayout';

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

describe('slotplanOverlapLayout', () => {
    it('keeps non-overlapping entries full width', () => {
        const layout = buildSlotplanOverlapLayout(
            [
                entry({ id: 1, startsAt: '2026-09-18T18:00:00+02:00', endsAt: '2026-09-18T19:00:00+02:00' }),
                entry({ id: 2, startsAt: '2026-09-18T19:00:00+02:00', endsAt: '2026-09-18T20:00:00+02:00' }),
            ],
            friday,
        );

        expect(layout.get(1)).toEqual({ laneCount: 1, laneIndex: 0 });
        expect(layout.get(2)).toEqual({ laneCount: 1, laneIndex: 0 });
    });

    it('splits a direct overlap into two lanes, earlier start first', () => {
        const layout = buildSlotplanOverlapLayout(
            [
                entry({ id: 2, startsAt: '2026-09-18T19:00:00+02:00', endsAt: '2026-09-18T21:00:00+02:00' }),
                entry({ id: 1, startsAt: '2026-09-18T18:00:00+02:00', endsAt: '2026-09-18T20:00:00+02:00' }),
            ],
            friday,
        );

        expect(layout.get(1)).toEqual({ laneCount: 2, laneIndex: 0 });
        expect(layout.get(2)).toEqual({ laneCount: 2, laneIndex: 1 });
    });

    it('packs a connected partial-overlap group into two lanes', () => {
        const layout = buildSlotplanOverlapLayout(
            [
                entry({ id: 1, startsAt: '2026-09-18T18:00:00+02:00', endsAt: '2026-09-18T20:00:00+02:00' }),
                entry({ id: 2, startsAt: '2026-09-18T19:30:00+02:00', endsAt: '2026-09-18T21:00:00+02:00' }),
                entry({ id: 3, startsAt: '2026-09-18T20:30:00+02:00', endsAt: '2026-09-18T22:00:00+02:00' }),
            ],
            friday,
        );

        expect(layout.get(1)).toEqual({ laneCount: 2, laneIndex: 0 });
        expect(layout.get(2)).toEqual({ laneCount: 2, laneIndex: 1 });
        expect(layout.get(3)).toEqual({ laneCount: 2, laneIndex: 0 });
    });

    it('puts the longer entry left when two entries start together', () => {
        const layout = buildSlotplanOverlapLayout(
            [
                entry({ id: 1, startsAt: '2026-09-18T16:00:00+02:00', endsAt: '2026-09-18T16:45:00+02:00' }),
                entry({ id: 2, startsAt: '2026-09-18T16:00:00+02:00', endsAt: '2026-09-18T22:00:00+02:00' }),
                entry({ id: 3, startsAt: '2026-09-18T16:45:00+02:00', endsAt: '2026-09-18T17:15:00+02:00' }),
            ],
            friday,
        );

        expect(layout.get(2)).toEqual({ laneCount: 2, laneIndex: 0 });
        expect(layout.get(1)).toEqual({ laneCount: 2, laneIndex: 1 });
        expect(layout.get(3)).toEqual({ laneCount: 2, laneIndex: 1 });
    });

    it('packs a long entry plus a sequential run into two lanes', () => {
        const layout = buildSlotplanOverlapLayout(
            [
                entry({ id: 1, startsAt: '2026-09-18T14:00:00+02:00', endsAt: '2026-09-18T18:00:00+02:00' }),
                entry({ id: 2, startsAt: '2026-09-18T14:15:00+02:00', endsAt: '2026-09-18T16:00:00+02:00' }),
                entry({ id: 3, startsAt: '2026-09-18T16:00:00+02:00', endsAt: '2026-09-18T16:30:00+02:00' }),
                entry({ id: 4, startsAt: '2026-09-18T16:30:00+02:00', endsAt: '2026-09-18T17:15:00+02:00' }),
                entry({ id: 5, startsAt: '2026-09-18T17:15:00+02:00', endsAt: '2026-09-18T18:15:00+02:00' }),
            ],
            friday,
        );

        expect(layout.get(1)).toEqual({ laneCount: 2, laneIndex: 0 });
        expect(layout.get(2)).toEqual({ laneCount: 2, laneIndex: 1 });
        expect(layout.get(3)).toEqual({ laneCount: 2, laneIndex: 1 });
        expect(layout.get(4)).toEqual({ laneCount: 2, laneIndex: 1 });
        expect(layout.get(5)).toEqual({ laneCount: 2, laneIndex: 1 });
    });

    it('keeps separate overlap groups at the same location independent', () => {
        const layout = buildSlotplanOverlapLayout(
            [
                entry({ id: 1, startsAt: '2026-09-18T14:00:00+02:00', endsAt: '2026-09-18T15:00:00+02:00' }),
                entry({ id: 2, startsAt: '2026-09-18T14:30:00+02:00', endsAt: '2026-09-18T15:30:00+02:00' }),
                entry({ id: 3, startsAt: '2026-09-18T20:00:00+02:00', endsAt: '2026-09-18T21:00:00+02:00' }),
                entry({ id: 4, startsAt: '2026-09-18T20:15:00+02:00', endsAt: '2026-09-18T21:15:00+02:00' }),
                entry({ id: 5, startsAt: '2026-09-18T20:30:00+02:00', endsAt: '2026-09-18T21:30:00+02:00' }),
            ],
            friday,
        );

        expect(layout.get(1)).toEqual({ laneCount: 2, laneIndex: 0 });
        expect(layout.get(2)).toEqual({ laneCount: 2, laneIndex: 1 });
        expect(layout.get(3)?.laneCount).toBe(3);
        expect(layout.get(4)?.laneCount).toBe(3);
        expect(layout.get(5)?.laneCount).toBe(3);
    });

    it('does not join overlaps at different program locations', () => {
        const layout = buildSlotplanOverlapLayout(
            [
                entry({ id: 1, programLocationId: 1, startsAt: '2026-09-18T18:00:00+02:00', endsAt: '2026-09-18T20:00:00+02:00' }),
                entry({ id: 2, programLocationId: 2, startsAt: '2026-09-18T18:00:00+02:00', endsAt: '2026-09-18T20:00:00+02:00' }),
            ],
            friday,
        );

        expect(layout.get(1)).toEqual({ laneCount: 1, laneIndex: 0 });
        expect(layout.get(2)).toEqual({ laneCount: 1, laneIndex: 0 });
    });

    it('treats a leftover all-day entry as spanning the day view', () => {
        const layout = buildSlotplanOverlapLayout(
            [
                entry({
                    id: 1,
                    allDayDates: ['2026-09-18'],
                    endsAt: null,
                    startsAt: null,
                    timeMode: ScheduleEntryTimeMode.AllDay,
                }),
                entry({ id: 2, startsAt: '2026-09-18T22:00:00+02:00', endsAt: '2026-09-18T23:00:00+02:00' }),
            ],
            friday,
        );

        expect(layout.get(1)).toEqual({ laneCount: 2, laneIndex: 0 });
        expect(layout.get(2)).toEqual({ laneCount: 2, laneIndex: 1 });
    });

    it('widens the location column by 48px per extra lane in the largest group', () => {
        expect(getSlotplanLocationColumnWidthPx(1)).toBe(190);
        expect(getSlotplanLocationColumnWidthPx(2)).toBe(238);
        expect(getSlotplanLocationColumnWidthPx(3)).toBe(286);

        const entries = [
            entry({ id: 1, startsAt: '2026-09-18T18:00:00+02:00', endsAt: '2026-09-18T20:00:00+02:00' }),
            entry({ id: 2, startsAt: '2026-09-18T19:00:00+02:00', endsAt: '2026-09-18T21:00:00+02:00' }),
            entry({ id: 3, programLocationId: 2, startsAt: '2026-09-18T18:00:00+02:00', endsAt: '2026-09-18T19:00:00+02:00' }),
        ];
        const layout = buildSlotplanOverlapLayout(entries, friday);

        expect(getSlotplanLocationColumnWidthsPx([1, 2], entries, layout)).toEqual([238, 190]);
    });
});
