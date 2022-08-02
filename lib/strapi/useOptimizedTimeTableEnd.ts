import { addHours, endOfHour, isAfter, startOfHour } from 'date-fns';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useOptimizedTimeTableEnd = (date: Date, timeTableItems: Array<ProgramItem>): Date => {

    const latestTimeTableItemEnd = timeTableItems.reduce<Date | null>(
        (currentLatestTimeTableItemEnd, timeTableItem) => {

            const timeTableItemEnd = new Date(timeTableItem.attributes.End);

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
