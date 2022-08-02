import { isBefore, startOfHour, subHours } from 'date-fns';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useOptimizedTimeTableBegin = (date: Date, timeTableItems: Array<ProgramItem>): Date => {

    const earliestTimeTableItemBegin = timeTableItems.reduce<Date | null>(
        (currentEarliestTimeTableItemBegin, timeTableItem) => {

            const timeTableItemBegin = new Date(timeTableItem.attributes.Begin);

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
        return startOfHour(date);
    }

    if (isBefore(subHours(earliestTimeTableItemBegin, 1), date)) {
        return startOfHour(date);
    }

    return startOfHour(subHours(earliestTimeTableItemBegin, 1));
};

export default useOptimizedTimeTableBegin;
