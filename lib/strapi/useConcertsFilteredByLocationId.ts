import type Concert from 'lib/strapi/Concert';

const useConcertsFilteredByLocationId = (concerts: Array<Concert>, locationId: number): Array<Concert> => (
    concerts.filter(concert => (
        concert.attributes.location.data?.id === locationId
    ))
);

export default useConcertsFilteredByLocationId;
