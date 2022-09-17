import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ReactElement } from 'react';
import Location from 'components/locations/Location';
import LocationWithProgramWrapper from 'components/locations/LocationWithProgramWrapper';
import { getLocationGroupOfLocation, useLocationGroupsContext } from 'lib/context/LocationGroupsContext';
import type { default as LocationModel } from 'lib/strapi/typings/Location';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import useLocationsSortingCallback from 'lib/strapi/useLocationsSortingCallback';

interface Props {
    allLocations: Array<LocationModel>;
    locationId?: number;
}

const LocationsMap = dynamic(() => import('components/locations/map/LocationsMap'), { ssr: false });

const LocationsList = ({ allLocations, locationId }: Props): ReactElement => {

    const { locationGroups } = useLocationGroupsContext();

    const locationsSortingCallback = useLocationsSortingCallback;

    const orderedLocations = allLocations
        .filter(location => locationId === undefined ? true : location.id === locationId)
        .sort(locationsSortingCallback);

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

            {locationId === undefined ? (
                <div className="space-y-5">
                    {allLocationGroups.map(locationGroup => {

                        const idOfFirstLocation = locationGroup.attributes.locations.data[0]!.id;

                        return (
                            <div key={locationGroup.id}>
                                <Link href={`/orte/${idOfFirstLocation}`}>
                                    <a className="cursor-pointer">
                                        <Location locationGroup={locationGroup} />
                                    </a>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <>
                    <div className="my-3">
                        <Link href="/orte">
                            <a className="text-blue-800 hover:text-blue-600 cursor-pointer leading-4">
                                <FontAwesomeIcon icon={faChevronLeft} /> <span className="text-lg">alle Locations ansehen</span>
                            </a>
                        </Link>
                    </div>

                    {allLocationGroups.map(locationGroup => (
                        <LocationWithProgramWrapper
                            key={locationGroup.id}
                            locationGroup={locationGroup}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default LocationsList;
