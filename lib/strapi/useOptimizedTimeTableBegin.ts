import { isBefore, isSameDay, startOfDay, startOfHour, subHours } from 'date-fns';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import useBeginFromItem from 'lib/strapi/useBeginFromItem';

const useOptimizedTimeTableBegin = (date: Date, timeTableItems: Array<ProgramItem>): Date => {

    const earliestTimeTableItemBegin = timeTableItems.reduce<Date | null>(
        (currentEarliestTimeTableItemBegin, timeTableItem) => {

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const timeTableItemBegin = useBeginFromItem(timeTableItem);

            if (currentEarliestTimeTableItemBegin === null) {
                return timeTableItemBegin;
            }

            return isBefore(timeTableItemBegin, currentEarliestTimeTableItemBegin)
                ? timeTableItemBegin
                : currentEarliestTimeTableItemBegin;
        },
        null
    );

    if (earliestTimeTableItemBegin === null) {
        return startOfDay(date);
    }

    if (!isSameDay(date, subHours(earliestTimeTableItemBegin, 1))) {
        return startOfDay(date);
    }

    return startOfHour(subHours(earliestTimeTableItemBegin, 1));
};

export default useOptimizedTimeTableBegin;
