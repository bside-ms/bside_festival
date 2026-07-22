import type { ScheduleEntry } from '@prisma/client';

export type SerializableScheduleEntry = Omit<ScheduleEntry, 'allDayDates' | 'createdAt' | 'endsAt' | 'startsAt' | 'updatedAt'> & {
    allDayDates: Array<string>;
    createdAt: string;
    endsAt: string | null;
    startsAt: string | null;
    updatedAt: string;
};
