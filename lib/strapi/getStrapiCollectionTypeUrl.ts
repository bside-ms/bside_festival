import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

const getStrapiCollectionTypeUrl = (collectionType: StrapiCollectionType, collectionTypeId: number): string => {

    return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_BASE_URL}admin/content-manager/collectionType/api::${collectionType}.${collectionType}/${collectionTypeId}`;
};

export default getStrapiCollectionTypeUrl;
