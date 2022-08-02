import { isAfter, isBefore, isSameMinute } from 'date-fns';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useProgramItemFilteredByDate = <T extends ProgramItem>(programItems: Array<T>, [begin, end]: ProgramDate): Array<T> => (
    programItems.filter(programItem => {

        const beginFromItem = new Date(programItem.attributes.Begin);
        const endFromItem = new Date(programItem.attributes.End);

        return (
            (
                isSameMinute(new Date(beginFromItem), begin) ||
                isAfter(new Date(beginFromItem), begin)
            ) && (
                isSameMinute(new Date(endFromItem), end) ||
                isBefore(new Date(endFromItem), end)
            )
        );
    })
);

export default useProgramItemFilteredByDate;
