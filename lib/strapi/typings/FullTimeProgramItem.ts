import type Exhibition from 'lib/strapi/typings/Exhibition';
import type Food from 'lib/strapi/typings/Food';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';

type FullTimeProgramItem = Exhibition | InformationBooth | Food;

export default FullTimeProgramItem;
