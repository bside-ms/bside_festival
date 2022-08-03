import { endOfDay, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type ProgramDate from 'lib/strapi/typings/ProgramDate';

const useExhibitionsFilteredByDate = (programItems: Array<Exhibition>, [begin]: ProgramDate): Array<Exhibition> => (
    programItems.filter(exhibition => {

        const exhibitionBegin = startOfDay(new Date(exhibition.attributes.Begin));
        const exhibitionEnd = endOfDay(new Date(exhibition.attributes.End));

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

export default useExhibitionsFilteredByDate;
