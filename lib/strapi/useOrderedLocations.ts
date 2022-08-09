import type Location from 'lib/strapi/typings/Location';
import useLocationsSortingCallback from 'lib/strapi/useLocationsSortingCallback';

const useOrderedLocations = (locations: Array<Location>): Array<Location> => {

    return locations.sort(useLocationsSortingCallback);
};

export default useOrderedLocations;
