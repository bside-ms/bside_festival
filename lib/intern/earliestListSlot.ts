import formatDate from '@/lib/common/helper/formatDate';
import type { ListParticipantEarliestSlot } from '@/typings/SerializableListParticipant';
import { ScheduleEntryTimeMode } from '@prisma/client';
import { first, minBy } from 'lodash';

export type ListScheduleEntryInput = {
    allDayDates: Array<string>;
    endsAt: Date | null;
    locationName: string;
    startsAt: Date | null;
    timeMode: ScheduleEntryTimeMode;
};

const allDaySortAt = (date: string): Date => new Date(`${date}T00:00:00+02:00`);

const getEntrySortAt = (entry: ListScheduleEntryInput): Date | null => {
    if (entry.timeMode === ScheduleEntryTimeMode.AllDay) {
        const earliestDate = first([...entry.allDayDates].sort());

        return earliestDate === undefined ? null : allDaySortAt(earliestDate);
    }

    return entry.startsAt;
};

const formatTimeLabel = (entry: ListScheduleEntryInput): string => {
    if (entry.timeMode === ScheduleEntryTimeMode.AllDay) {
        const dates = [...entry.allDayDates].sort();

        if (dates.length === 0) {
            return 'Ganztägig';
        }

        if (dates.length === 1) {
            return `${formatDate(allDaySortAt(dates[0]!), 'EEE dd.MM.')} ganztägig`;
        }

        return `${formatDate(allDaySortAt(dates[0]!), 'EEE dd.MM.')}–${formatDate(allDaySortAt(dates[dates.length - 1]!), 'EEE dd.MM.')}`;
    }

    if (entry.startsAt === null) {
        return '—';
    }

    if (entry.endsAt === null) {
        return formatDate(entry.startsAt, 'EEE dd.MM. HH:mm');
    }

    return `${formatDate(entry.startsAt, 'EEE dd.MM. HH:mm')}–${formatDate(entry.endsAt, 'HH:mm')}`;
};

const toEarliestListSlot = (entries: Array<ListScheduleEntryInput>): ListParticipantEarliestSlot | null => {
    if (entries.length === 0) {
        return null;
    }

    const ranked = entries
        .map((entry) => {
            const sortAt = getEntrySortAt(entry);

            return sortAt === null ? null : { entry, sortAt };
        })
        .filter((row): row is { entry: ListScheduleEntryInput; sortAt: Date } => row !== null);

    const earliest = minBy(ranked, ({ sortAt }) => sortAt.getTime());

    if (earliest === undefined) {
        return null;
    }

    return {
        additionalSlotCount: entries.length - 1,
        locationName: earliest.entry.locationName,
        sortAt: earliest.sortAt.toISOString(),
        timeLabel: formatTimeLabel(earliest.entry),
    };
};

export default toEarliestListSlot;
