import { useCallback, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import LocationMapContainer from 'components/locations/map/LocationMapContainer';
import LocationMapHints from 'components/locations/map/LocationMapHints';
import { getLocationGroupOfLocation, useLocationGroupsContext } from 'lib/context/LocationGroupsContext';
import getLocationCoordinates from 'lib/locations/map/getLocationCoordinates';
import type LocationMarker from 'lib/locations/map/LocationMarker';
import type Location from 'lib/strapi/typings/Location';

interface Props {
    allLocations: Array<Location>;
}

const LocationsMap = ({ allLocations }: Props): ReactElement => {

    const { locationGroups } = useLocationGroupsContext();

    const [mapMarkers, setMapMarkers] = useState<Array<LocationMarker>>([]);
    const [coordinateLookUpHints, setCoordinateLookUpHints] = useState<Array<string>>([]);

    const addLookUpHint = useCallback((hint: string): void => {

        setCoordinateLookUpHints(prevState => {

            if (prevState.includes(hint)) {
                return prevState;
            }
            return [...prevState, hint];
        });
    }, []);

    useEffect(
        () => {
            setMapMarkers([]);
            setCoordinateLookUpHints([]);

            allLocations.forEach(async location => {
                const groupOfLocation = getLocationGroupOfLocation(locationGroups, location);

                const latLng = await getLocationCoordinates(
                    location.attributes.Name,
                    groupOfLocation?.attributes.Name ?? null,
                    location.attributes.Address,
                    location.attributes.Coordinates,
                    addLookUpHint
                );

                if (latLng === null) {
                    return;
                }

                setMapMarkers(prevState => {

                    if (prevState.findIndex(marker => marker.locationId === location.id) !== -1) {
                        return prevState;
                    }

                    const nameOnMarker = `
                        ${location.attributes.Name}
                        ${groupOfLocation?.attributes.Name === undefined ? '' : ` (${groupOfLocation.attributes.Name})`}
                    `;

                    return [
                        ...prevState,
                        {
                            locationId: location.id,
                            name: nameOnMarker,
                            address: location.attributes.Address,
                            ...latLng,
                        },
                    ];
                });
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <div className="mb-3">
            <LocationMapContainer mapMarkers={mapMarkers} />
            <LocationMapHints coordinateLookUpHints={coordinateLookUpHints} />
        </div>
    );
};

export default LocationsMap;
