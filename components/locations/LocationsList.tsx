import dynamic from 'next/dynamic';
import type { ReactElement } from 'react';
import Location from 'components/locations/Location';
import { getLocationGroupOfLocation, useLocationGroupsContext } from 'lib/context/LocationGroupsContext';
import type { default as LocationModel } from 'lib/strapi/typings/Location';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import useLocationsSortingCallback from 'lib/strapi/useLocationsSortingCallback';

interface Props {
    allLocations: Array<LocationModel>;
}

const LocationsMap = dynamic(() => import('components/locations/map/LocationsMap'), { ssr: false });

const LocationsList = ({ allLocations }: Props): ReactElement => {

    const { locationGroups } = useLocationGroupsContext();

    const locationsSortingCallback = useLocationsSortingCallback;

    const orderedLocations = allLocations.sort(locationsSortingCallback);

    const allLocationGroups = orderedLocations.reduce<Array<LocationGroup>>(
        (currentLocationGroups, location) => {

            const locationGroup = getLocationGroupOfLocation(locationGroups, location);

            if (locationGroup !== null) {

                if (currentLocationGroups.some(group => group.id === locationGroup.id)) {
                    return currentLocationGroups;
                }

                currentLocationGroups.push(locationGroup);

                return currentLocationGroups;
            }

            const fakedLocationGroup: LocationGroup = {
                // The ugliest way I could think of to distinguish
                // real location groups from fake ones
                id: 600 + location.id,
                attributes: {
                    ...location.attributes,
                    locations: {
                        data: [location],
                    },
                },
            };

            currentLocationGroups.push(fakedLocationGroup);

            return currentLocationGroups;
        },
        new Array<LocationGroup>()
    );

    return (
        <div>
            <LocationsMap allLocations={orderedLocations} />

            <div className="space-y-5">
                {allLocationGroups.map(locationGroup => (
                    <Location
                        key={locationGroup.id}
                        locationGroup={locationGroup}
                    />
                ))}
            </div>
        </div>
    );
};

export default LocationsList;
