const useStrapiConcertUrl = (concertId: number): string => {

    return `https://cms.b-side.ms/admin/content-manager/collectionType/api::concert.concert/${concertId}`;
};

export default useStrapiConcertUrl;
