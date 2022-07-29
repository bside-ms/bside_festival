const useStrapiCollectionTypeUrl = (collectionType: string, collectionTypeId: number): string => {

    return `https://cms.b-side.ms/admin/content-manager/collectionType/api::${collectionType}.${collectionType}/${collectionTypeId}`;
};

export default useStrapiCollectionTypeUrl;
