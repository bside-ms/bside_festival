import type Location from 'lib/strapi/Location';
import type TimeTableItem from 'lib/strapi/TimeTableItem';

const useLocationsFromTimeTableItems = (timeTableItems: Array<TimeTableItem>): Array<Location> => (
    timeTableItems.reduce(
        (locations, concert) => {

            const location = concert.attributes.location.data ?? null;

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
);

export default useLocationsFromTimeTableItems;
