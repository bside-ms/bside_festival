import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

export default interface ErroneousProgramItem {
    collectionType: StrapiCollectionType;
    programItem: ProgramItem;
    reason: string;
}
