import { ScheduleEntryTimeMode } from '@prisma/client';
import { isAfter, isBefore } from 'date-fns';
import { groupBy, max, sortBy } from 'lodash';
import type { SerializableScheduleEntry } from '../../typings/SerializableScheduleEntry';
import formatDate from '../common/helper/formatDate';
import type { FestivalDayView } from '../schedule/festivalWindow';

const slotplanLocationColumnBaseWidthPx = 190;
const slotplanOverlapColumnExtraPx = 48;

export interface SlotplanOverlapPlacement {
    chainSize: number;
    index: number;
}

interface TimedInterval {
    endsAt: Date;
    id: number;
    programLocationId: number;
    startsAt: Date;
}

export const getSlotplanLocationColumnWidthPx = (maxChainSize: number): number =>
    slotplanLocationColumnBaseWidthPx + slotplanOverlapColumnExtraPx * Math.max(0, maxChainSize - 1);

export const getSlotplanEntryInterval = (
    entry: SerializableScheduleEntry,
    dayView: FestivalDayView,
): Pick<TimedInterval, 'endsAt' | 'startsAt'> | null => {
    if (entry.timeMode === ScheduleEntryTimeMode.AllDay) {
        if (!entry.allDayDates.includes(formatDate(dayView.startsAt, 'yyyy-MM-dd'))) {
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
        getOverlapChains(locationIntervals).forEach((chain) => {
            const orderedChain = sortBy(chain, ['startsAt', 'id']);

            orderedChain.forEach((interval, index) => {
                layout.set(interval.id, { chainSize: orderedChain.length, index });
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
        const chainSizes = entries
            .filter((entry) => entry.programLocationId === locationId)
            .map((entry) => layout.get(entry.id)?.chainSize ?? 1);

        return getSlotplanLocationColumnWidthPx(max(chainSizes) ?? 1);
    });

const intervalsOverlap = (left: TimedInterval, right: TimedInterval): boolean =>
    isBefore(left.startsAt, right.endsAt) && isAfter(left.endsAt, right.startsAt);

const getOverlapChains = (intervals: Array<TimedInterval>): Array<Array<TimedInterval>> => {
    const remaining = [...intervals];
    const chains: Array<Array<TimedInterval>> = [];

    while (remaining.length > 0) {
        const chain = [remaining.shift()!];

        for (let index = 0; index < remaining.length; ) {
            const candidate = remaining[index]!;
            const touchesChain = chain.some((interval) => intervalsOverlap(interval, candidate));

            if (touchesChain) {
                chain.push(candidate);
                remaining.splice(index, 1);
                index = 0;
                continue;
            }

            index += 1;
        }

        chains.push(chain);
    }

    return chains;
};
