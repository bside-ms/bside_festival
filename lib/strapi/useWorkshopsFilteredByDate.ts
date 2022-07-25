import { isSameDay } from 'date-fns';
import type Workshop from 'lib/strapi/Workshop';

const useWorkshopsFilteredByDate = (workshops: Array<Workshop>, date: Date): Array<Workshop> => (
    workshops.filter(workshop => isSameDay(new Date(workshop.attributes.Date), date))
);

export default useWorkshopsFilteredByDate;
