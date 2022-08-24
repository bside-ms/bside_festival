import { isAfter, isBefore, isSameMinute } from 'date-fns';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useProgramItemFilteredByDateFunction = <T extends ProgramItem>(): (programItem: T, date: ProgramDate) => boolean => {

    return (programItem: T, [begin, end]: ProgramDate): boolean => {

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
