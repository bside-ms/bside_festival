import dynamic from 'next/dynamic';
import type { ReactElement } from 'react';
import Location from 'components/locations/Location';
import type { default as LocationModel } from 'lib/strapi/typings/Location';
import useLocationsSortingCallback from 'lib/strapi/useLocationsSortingCallback';

interface Props {
    allLocations: Array<LocationModel>;
}

const LocationsMap = dynamic(() => import('components/locations/map/LocationsMap'), { ssr: false });

const LocationsList = ({ allLocations }: Props): ReactElement => {

    const locationsSortingCallback = useLocationsSortingCallback;

    const orderedLocations = allLocations.sort(locationsSortingCallback);

    return (
        <div>
            <LocationsMap allLocations={orderedLocations} />

            <div className="space-y-5">
                {orderedLocations.map(location => (
                    <Location
                        key={location.id}
                        location={location}
                    />
                ))}
            </div>
        </div>
    );
};

export default LocationsList;
