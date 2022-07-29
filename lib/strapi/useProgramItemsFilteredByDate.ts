import { isSameDay } from 'date-fns';
import type Performance from 'lib/strapi/typings/Performance';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';

const useProgramItemFilteredByDate = <T extends Performance | Reading | Workshop>(programItems: Array<T>, date: Date): Array<T> => (
    programItems.filter(programItem => isSameDay(new Date(programItem.attributes.Date), date))
);

export default useProgramItemFilteredByDate;
