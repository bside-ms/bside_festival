import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type Location from 'lib/strapi/typings/Location';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import useLocationsSortingCallback from 'lib/strapi/useLocationsSortingCallback';

const useLocationsFromTimeTableItems = (timeTableItems: Array<ProgramItem | FullTimeProgramItem>): Array<Location> => {

    return timeTableItems
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
        .sort(useLocationsSortingCallback)
    ;
};

export default useLocationsFromTimeTableItems;
