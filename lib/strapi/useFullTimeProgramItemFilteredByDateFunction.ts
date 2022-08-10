import { endOfDay, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { useIsProgramItemFilteredFunction } from 'lib/context/ProgramItemTypeFiltersContext';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

const useFullTimeProgramItemFilteredByDateFunction = <T extends FullTimeProgramItem>(): (programItem: T, [begin]: ProgramDate) => boolean => {

    const isProgramItemFilteredFunction = useIsProgramItemFilteredFunction();

    return (programItem: T, [begin]: ProgramDate): boolean => {

        if (isProgramItemFilteredFunction(programItem)) {
            return false;
        }

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
    };
};

export default useFullTimeProgramItemFilteredByDateFunction;
