import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

const useStrapiCollectionTypeUrl = (collectionType: StrapiCollectionType, collectionTypeId: number): string => {

    return `https://cms.b-side.ms/admin/content-manager/collectionType/api::${collectionType}.${collectionType}/${collectionTypeId}`;
};

export default useStrapiCollectionTypeUrl;
