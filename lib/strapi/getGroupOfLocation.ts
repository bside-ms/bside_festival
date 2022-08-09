import type Location from 'lib/strapi/typings/Location';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';

const getGroupOfLocation = (location: Location, locationGroups: Array<LocationGroup>): LocationGroup | null => {

    const matchingLocationGroups = locationGroups.filter(
        locationGroup => locationGroup.attributes.locations.data.some(locationItem => locationItem.id === location.id)
    );

    if (matchingLocationGroups.length > 1) {
        console.error('A location must only be associated with one location group');
    }

    return matchingLocationGroups[0] ?? null;
};

export default getGroupOfLocation;
