import getGroupOfLocation from 'lib/strapi/getGroupOfLocation';
import type Location from 'lib/strapi/typings/Location';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';

const orderLocations = (locations: Array<Location>, locationGroups: Array<LocationGroup>): Array<Location> => {

    return locations.sort(
        (locationA, locationB) => {

            const groupOfLocationA = getGroupOfLocation(locationA, locationGroups);
            const groupOfLocationB = getGroupOfLocation(locationB, locationGroups);

            const locationASortingName = `${groupOfLocationA?.attributes.Name ?? ''}${locationA.attributes.Name}`;
            const locationBSortingName = `${groupOfLocationB?.attributes.Name ?? ''}${locationB.attributes.Name}`;

            return locationASortingName.localeCompare(locationBSortingName);
        }
    );
};

export default orderLocations;
