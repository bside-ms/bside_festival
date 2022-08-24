import { endOfDay, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

const useFullTimeProgramItemFilteredByDateFunction = <T extends FullTimeProgramItem>(): (programItem: T, [begin]: ProgramDate) => boolean => {

    return (programItem: T, [begin]: ProgramDate): boolean => {

        const programItemBegin = startOfDay(new Date(programItem.attributes.Begin));
        const programItemEnd = endOfDay(new Date(programItem.attributes.End));

        // Only using begin here on purpose, because end is next day
        return (
            (
                isSameDay(programItemBegin, begin) ||
                isBefore(programItemBegin, begin)
            ) && (
                isSameDay(programItemEnd, begin) ||
                isAfter(programItemEnd, begin)
            )
        );
    };
};

export default useFullTimeProgramItemFilteredByDateFunction;
