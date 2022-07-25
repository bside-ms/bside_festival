const useStrapiConcertUrl = (workshopId: number): string => {

    return `https://cms.b-side.ms/admin/content-manager/collectionType/api::workshop.workshop/${workshopId}`;
};

export default useStrapiConcertUrl;
