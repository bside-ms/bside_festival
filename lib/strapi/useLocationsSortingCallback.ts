import { useLocationGroupOfLocation } from 'lib/context/LocationGroupsContext';
import type Location from 'lib/strapi/typings/Location';

const useLocationsSortingCallback = (locationA: Location, locationB: Location): number => {

    const groupOfLocationA = useLocationGroupOfLocation(locationA);
    const groupOfLocationB = useLocationGroupOfLocation(locationB);

    const locationASortingName = `${groupOfLocationA?.attributes.Name ?? ''}${locationA.attributes.Name}`;
    const locationBSortingName = `${groupOfLocationB?.attributes.Name ?? ''}${locationB.attributes.Name}`;

    return locationASortingName.localeCompare(locationBSortingName);
};

export default useLocationsSortingCallback;
