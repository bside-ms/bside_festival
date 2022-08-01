import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type ErroneousProgramItem from 'lib/strapi/typings/ErroneousProgramItem';

export default interface AllProgramItemsResponse {
    allProgramItems: AllProgramItems;
    erroneousProgramItems: Array<ErroneousProgramItem>;
}
