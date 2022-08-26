import { endOfDay, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { useProgramContext } from 'components/program/program/ProgramContext';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';

const useFullTimeProgramItemFilteredByDateFunction = <T extends FullTimeProgramItem>(): (programItem: T) => boolean => {

    const { programDate } = useProgramContext();

    return (programItem: T): boolean => {

        if (programDate === null) {
            return false;
        }

        const [begin] = programDate;

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
