import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import type { Prisma, ScheduleEntry } from '@prisma/client';

const parseAllDayDates = (allDayDates: Prisma.JsonValue): Array<string> => {
    if (!Array.isArray(allDayDates)) {
        return [];
    }

    return allDayDates.filter((date): date is string => typeof date === 'string');
};

const serializeScheduleEntry = (scheduleEntry: ScheduleEntry): SerializableScheduleEntry => ({
    ...scheduleEntry,
    allDayDates: parseAllDayDates(scheduleEntry.allDayDates),
    createdAt: scheduleEntry.createdAt.toString(),
    endsAt: scheduleEntry.endsAt?.toString() ?? null,
    startsAt: scheduleEntry.startsAt?.toString() ?? null,
    updatedAt: scheduleEntry.updatedAt.toString(),
});

export default serializeScheduleEntry;
