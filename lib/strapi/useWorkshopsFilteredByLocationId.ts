import type Workshop from 'lib/strapi/Workshop';

const useWorkshopsFilteredByLocationId = (workshops: Array<Workshop>, locationId: number): Array<Workshop> => (
    workshops.filter(workshop => (
        workshop.attributes.location.data?.id === locationId
    ))
);

export default useWorkshopsFilteredByLocationId;
