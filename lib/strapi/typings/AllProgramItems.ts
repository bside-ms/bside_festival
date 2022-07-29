import type Concert from 'lib/strapi/typings/Concert';
import type Performance from 'lib/strapi/typings/Performance';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';

export default interface AllProgramItems {
  concerts: Array<Concert> | null;
  performances: Array<Performance> | null;
  readings: Array<Reading> | null;
  workshops: Array<Workshop> | null;
}
