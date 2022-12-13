import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

const getStrapiCollectionTypeUrl = (collectionType: StrapiCollectionType, collectionTypeId: number): string => {

    const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_IMAGE_BASE_URL ?? '';
    return `${strapiBaseUrl}admin/content-manager/collectionType/api::${collectionType}.${collectionType}/${collectionTypeId}`;
};

export default getStrapiCollectionTypeUrl;
