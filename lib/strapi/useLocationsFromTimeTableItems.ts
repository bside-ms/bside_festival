import orderLocations from 'lib/strapi/orderLocations';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type Location from 'lib/strapi/typings/Location';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

const useLocationsFromTimeTableItems = (timeTableItems: Array<ProgramItem | FullTimeProgramItem>, allLocationGroups: Array<LocationGroup>): Array<Location> => (
    orderLocations(
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
            ),
        allLocationGroups
    )
);

export default useLocationsFromTimeTableItems;
