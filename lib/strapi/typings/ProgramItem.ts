import type Concert from 'lib/strapi/typings/Concert';
import type Performance from 'lib/strapi/typings/Performance';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';

type ProgramItem = Concert | Performance | Reading | Workshop;

export default ProgramItem;
