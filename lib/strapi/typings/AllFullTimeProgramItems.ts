import type Exhibition from 'lib/strapi/typings/Exhibition';
import type Food from 'lib/strapi/typings/Food';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';

export default interface AllFullTimeProgramItems {
  exhibitions: Array<Exhibition> | null;
  foods: Array<Food> | null;
  informationBooths: Array<InformationBooth> | null;
}
