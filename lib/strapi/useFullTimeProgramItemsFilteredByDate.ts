import { endOfDay, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

const useFullTimeProgramItemsFilteredByDate = <T extends FullTimeProgramItem>(programItems: Array<T>, [begin]: ProgramDate): Array<T> => (
    programItems.filter(programItem => {

        const exhibitionBegin = startOfDay(new Date(programItem.attributes.Begin));
        const exhibitionEnd = endOfDay(new Date(programItem.attributes.End));

        // Only using begin here on purpose, because end is next day
        return (
            (
                isSameDay(exhibitionBegin, begin) ||
                isBefore(exhibitionBegin, begin)
            ) && (
                isSameDay(exhibitionEnd, begin) ||
                isAfter(exhibitionEnd, begin)
            )
        );
    })
);

export default useFullTimeProgramItemsFilteredByDate;
