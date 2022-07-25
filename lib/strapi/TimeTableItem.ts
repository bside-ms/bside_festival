import type Concert from 'lib/strapi/Concert';
import type Workshop from 'lib/strapi/Workshop';

type TimeTableItem = Concert | Workshop;

export default TimeTableItem;
