import { addHours, endOfHour, isAfter, startOfHour } from 'date-fns';
import getEndFromItem from 'lib/strapi/getEndFromItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useOptimizedTimeTableEnd = (date: Date, timeTableItems: Array<ProgramItem>): Date => {

    const latestTimeTableItemEnd = timeTableItems.reduce<Date | null>(
        (currentLatestTimeTableItemEnd, timeTableItem) => {

            const timeTableItemEnd = getEndFromItem(timeTableItem);

            if (currentLatestTimeTableItemEnd === null) {
                return timeTableItemEnd;
            }

            return isAfter(timeTableItemEnd, currentLatestTimeTableItemEnd)
                ? timeTableItemEnd
                : currentLatestTimeTableItemEnd;
        },
        null
    );

    if (latestTimeTableItemEnd === null) {
        return endOfHour(date);
    }

    if (isAfter(addHours(latestTimeTableItemEnd, 2), date)) {
        return endOfHour(date);
    }

    return startOfHour(addHours(latestTimeTableItemEnd, 2));
};

export default useOptimizedTimeTableEnd;
