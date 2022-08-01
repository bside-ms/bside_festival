import { isAfter, isBefore, isSameMinute } from 'date-fns';
import getBeginFromItem from 'lib/strapi/getBeginFromItem';
import getEndFromItem from 'lib/strapi/getEndFromItem';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useProgramItemFilteredByDate = <T extends ProgramItem>(programItems: Array<T>, [begin, end]: ProgramDate): Array<T> => (
    programItems.filter(programItem => {

        const beginFromItem = getBeginFromItem(programItem);
        const endFromItem = getEndFromItem(programItem);

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
