import { isAfter, isBefore, isSameMinute } from 'date-fns';
import { useProgramContext } from 'components/program/program/ProgramContext';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useProgramItemFilteredByDateFunction = <T extends ProgramItem>(): (programItem: T) => boolean => {

    const { programDate } = useProgramContext();

    return (programItem: T): boolean => {

        if (programDate === null) {
            return false;
        }

        const [begin, end] = programDate;

        const beginFromItem = new Date(programItem.attributes.Begin);
        const endFromItem = new Date(programItem.attributes.End);

        return (
            (
                isSameMinute(beginFromItem, begin) ||
                isAfter(beginFromItem, begin)
            ) && (
                isSameMinute(endFromItem, end) ||
                isBefore(endFromItem, end)
            )
        );
    };
};

export default useProgramItemFilteredByDateFunction;
