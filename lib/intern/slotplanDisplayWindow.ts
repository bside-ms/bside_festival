import { ScheduleEntryTimeMode } from '@prisma/client';
import { addHours } from 'date-fns';
import { compact, max, min } from 'lodash';
import type { SerializableScheduleEntry } from '../../typings/SerializableScheduleEntry';
import type { FestivalDayView } from '../schedule/festivalWindow';

const slotplanDisplayPaddingHours = 1;

export const getSlotplanDisplayWindow = (entries: Array<SerializableScheduleEntry>, dayView: FestivalDayView): FestivalDayView => {
    const timedStartsAt = compact(
        entries.map((entry) => {
            if (entry.timeMode === ScheduleEntryTimeMode.AllDay || entry.startsAt === null) {
                return null;
            }

            return new Date(entry.startsAt);
        }),
    );
    const timedEndsAt = compact(
        entries.map((entry) => {
            if (entry.timeMode === ScheduleEntryTimeMode.AllDay || entry.endsAt === null) {
                return null;
            }

            return new Date(entry.endsAt);
        }),
    );
    const firstStartsAt = min(timedStartsAt);
    const lastEndsAt = max(timedEndsAt);

    if (firstStartsAt === undefined || lastEndsAt === undefined) {
        return dayView;
    }

    return {
        ...dayView,
        startsAt: addHours(firstStartsAt, -slotplanDisplayPaddingHours),
        endsAt: addHours(lastEndsAt, slotplanDisplayPaddingHours),
    };
};
