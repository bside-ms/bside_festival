import { addHours, endOfDay, isAfter, isSameDay, startOfHour } from 'date-fns';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import useEndFromItem from 'lib/strapi/useEndFromItem';

const useOptimizedTimeTableEnd = (date: Date, timeTableItems: Array<ProgramItem>): Date => {

    const latestTimeTableItemEnd = timeTableItems.reduce<Date | null>(
        (currentLatestTimeTableItemEnd, timeTableItem) => {

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const timeTableItemEnd = useEndFromItem(timeTableItem);

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
        return endOfDay(date);
    }

    if (!isSameDay(date, addHours(latestTimeTableItemEnd, 2))) {
        return endOfDay(date);
    }

    return startOfHour(addHours(latestTimeTableItemEnd, 2));
};

export default useOptimizedTimeTableEnd;
