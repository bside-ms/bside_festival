import type Exhibition from 'lib/strapi/typings/Exhibition';
import type Location from 'lib/strapi/typings/Location';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useLocationsFromTimeTableItems = (timeTableItems: Array<ProgramItem | Exhibition>): Array<Location> => (
    timeTableItems
        .reduce(
            (locations, timeTableItem) => {

                const location = timeTableItem.attributes.location.data ?? null;

                if (location === null) {
                    return locations;
                }

                const foundIndex = locations.findIndex(
                    (locationItem) => locationItem.id === location.id
                );

                if (foundIndex === -1) {
                    locations.push(location);
                }

                return locations;
            },
            new Array<Location>()
        )
        .sort(
            (locationA, locationB) => (
                locationA.attributes.Name.localeCompare(locationB.attributes.Name)
            )
        )
);

export default useLocationsFromTimeTableItems;
