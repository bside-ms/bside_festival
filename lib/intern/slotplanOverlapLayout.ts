import { ScheduleEntryTimeMode } from '@prisma/client';
import { isAfter, isBefore } from 'date-fns';
import { findIndex, groupBy, max, sortBy } from 'lodash';
import type { SerializableScheduleEntry } from '../../typings/SerializableScheduleEntry';
import formatDate from '../common/helper/formatDate';
import { festivalDayViews, type FestivalDayView } from '../schedule/festivalWindow';

const slotplanLocationColumnBaseWidthPx = 190;
const slotplanOverlapColumnExtraPx = 48;

export interface SlotplanOverlapPlacement {
    laneCount: number;
    laneIndex: number;
}

interface TimedInterval {
    endsAt: Date;
    id: number;
    programLocationId: number;
    startsAt: Date;
}

export const getSlotplanLocationColumnWidthPx = (maxLaneCount: number): number =>
    slotplanLocationColumnBaseWidthPx + slotplanOverlapColumnExtraPx * Math.max(0, maxLaneCount - 1);

export const getSlotplanEntryInterval = (
    entry: SerializableScheduleEntry,
    dayView: FestivalDayView,
): Pick<TimedInterval, 'endsAt' | 'startsAt'> | null => {
    if (entry.timeMode === ScheduleEntryTimeMode.AllDay) {
        const dayDate = formatDate(
            festivalDayViews.find(({ label }) => label === dayView.label)?.startsAt ?? dayView.startsAt,
            'yyyy-MM-dd',
        );

        if (!entry.allDayDates.includes(dayDate)) {
            return null;
        }

        return { startsAt: dayView.startsAt, endsAt: dayView.endsAt };
    }

    if (entry.startsAt === null || entry.endsAt === null) {
        return null;
    }

    const startsAt = new Date(entry.startsAt);
    const endsAt = new Date(entry.endsAt);

    if (!isBefore(startsAt, dayView.endsAt) || !isAfter(endsAt, dayView.startsAt)) {
        return null;
    }

    return { startsAt, endsAt };
};

export const buildSlotplanOverlapLayout = (
    entries: Array<SerializableScheduleEntry>,
    dayView: FestivalDayView,
): Map<number, SlotplanOverlapPlacement> => {
    const intervals = entries.flatMap((entry) => {
        const interval = getSlotplanEntryInterval(entry, dayView);

        if (interval === null) {
            return [];
        }

        return [{ id: entry.id, programLocationId: entry.programLocationId, ...interval }];
    });

    const layout = new Map<number, SlotplanOverlapPlacement>();

    Object.values(groupBy(intervals, 'programLocationId')).forEach((locationIntervals) => {
        getOverlapGroups(locationIntervals).forEach((group) => {
            assignLanes(group).forEach((placement, id) => {
                layout.set(id, placement);
            });
        });
    });

    return layout;
};

export const getSlotplanLocationColumnWidthsPx = (
    locationIds: Array<number>,
    entries: Array<SerializableScheduleEntry>,
    layout: Map<number, SlotplanOverlapPlacement>,
): Array<number> =>
    locationIds.map((locationId) => {
        const laneCounts = entries
            .filter((entry) => entry.programLocationId === locationId)
            .map((entry) => layout.get(entry.id)?.laneCount ?? 1);

        return getSlotplanLocationColumnWidthPx(max(laneCounts) ?? 1);
    });

const intervalsOverlap = (left: TimedInterval, right: TimedInterval): boolean =>
    isBefore(left.startsAt, right.endsAt) && isAfter(left.endsAt, right.startsAt);

const getOverlapGroups = (intervals: Array<TimedInterval>): Array<Array<TimedInterval>> => {
    const remaining = [...intervals];
    const groups: Array<Array<TimedInterval>> = [];

    while (remaining.length > 0) {
        const group = [remaining.shift()!];

        for (let index = 0; index < remaining.length; ) {
            const candidate = remaining[index]!;
            const touchesGroup = group.some((interval) => intervalsOverlap(interval, candidate));

            if (touchesGroup) {
                group.push(candidate);
                remaining.splice(index, 1);
                index = 0;
                continue;
            }

            index += 1;
        }

        groups.push(group);
    }

    return groups;
};

const assignLanes = (group: Array<TimedInterval>): Map<number, SlotplanOverlapPlacement> => {
    const orderedGroup = sortBy(group, [
        (interval) => interval.startsAt.getTime(),
        (interval) => interval.startsAt.getTime() - interval.endsAt.getTime(),
        'id',
    ]);
    const laneEndsAt: Array<Date> = [];
    const laneById = new Map<number, number>();

    orderedGroup.forEach((interval) => {
        const laneIndex = findIndex(laneEndsAt, (endsAt) => !isAfter(endsAt, interval.startsAt));

        if (laneIndex === -1) {
            laneById.set(interval.id, laneEndsAt.length);
            laneEndsAt.push(interval.endsAt);
            return;
        }

        laneEndsAt[laneIndex] = interval.endsAt;
        laneById.set(interval.id, laneIndex);
    });

    const laneCount = laneEndsAt.length;
    const layout = new Map<number, SlotplanOverlapPlacement>();

    laneById.forEach((laneIndex, id) => {
        layout.set(id, { laneCount, laneIndex });
    });

    return layout;
};
