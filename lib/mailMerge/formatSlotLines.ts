import formatDate from '@/lib/common/helper/formatDate';
import { ScheduleEntryTimeMode } from '@prisma/client';
import { compact, sortBy } from 'lodash';

export type MailMergeSlotInput = {
    endsAt: Date | null;
    locationName: string;
    startsAt: Date | null;
    timeMode: ScheduleEntryTimeMode;
};

const formatMailMergeSlotLine = (slot: MailMergeSlotInput): string | null => {
    const location = slot.locationName.trim();

    if (location.length === 0) {
        return null;
    }

    if (slot.timeMode === ScheduleEntryTimeMode.AllDay || slot.startsAt === null) {
        return `ganztägig, ${location}`;
    }

    const datePart = formatDate(slot.startsAt, 'EEEE, dd.MM.yy');
    const startTime = formatDate(slot.startsAt, 'HH:mm');
    const timePart = slot.endsAt === null ? `${startTime} Uhr` : `${startTime}–${formatDate(slot.endsAt, 'HH:mm')} Uhr`;

    return `${datePart}, ${timePart}, ${location}`;
};

export const formatMailMergeSlotLines = (slots: Array<MailMergeSlotInput>): string =>
    compact(sortBy(slots, (slot) => slot.startsAt?.getTime() ?? Number.POSITIVE_INFINITY).map(formatMailMergeSlotLine)).join('\n');
