import { isSameDay } from 'date-fns';
import type Concert from 'lib/strapi/Concert';

const useConcertsFilteredByDate = (concerts: Array<Concert>, date: Date): Array<Concert> => (
    concerts.filter(concert => (
        isSameDay(new Date(concert.attributes.Begin), date) ||
        isSameDay(new Date(concert.attributes.End), date)
    ))
);

export default useConcertsFilteredByDate;
