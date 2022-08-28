import { useCallback, useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import { toNumber } from 'lodash';
import type { ReactElement } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { getLocationGroupOfLocation, useLocationGroupsContext } from 'lib/context/LocationGroupsContext';
import type Location from 'lib/strapi/typings/Location';

interface Props {
    allLocations: Array<Location>;
}

interface LocationMarker {
    locationId: number;
    name: string;
    address: string | null;
    latitude: number;
    longitude: number;
}

interface PositionStackForwardResponse {
    data: Array<{
        latitude: number;
        longitude: number;
    }>;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

const getLocationCoordinates = async (
    name: string,
    address: string | null,
    coordinates: string | null,
    addLookUpHint: (hint: string) => void
): Promise<Coordinates | null> => {

    if (coordinates !== '' && coordinates !== null) {
        const splitCoords = coordinates.split(',');

        if (splitCoords.length !== 2) {
            addLookUpHint(`Die Koordinaten "${coordinates}" für die Location "${name}" haben ein unerwartetes Format`);
            return null;
        }

        const latitude = toNumber(splitCoords[0]);
        const longitude = toNumber(splitCoords[1]);

        if (isNaN(latitude) || isNaN(longitude)) {
            addLookUpHint(`Die Koordinaten "${coordinates}" für die Location "${name}" haben ein unerwartetes Format`);
            return null;
        }

        return { latitude, longitude };
    }

    if (address === null || address === '') {
        addLookUpHint(`Für die Location "${name}" fehlen noch Adresse und Koordinaten`);

        return null;
    }

    const apiKey = '09514e10a70fd729688307dac11a8ffa';

    const url = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${name},${address}`;

    const response = await fetch(url);

    const result: PositionStackForwardResponse = await response.json();

    const resultCoordinates = result.data[0] ?? null;

    if (resultCoordinates === null) {
        addLookUpHint(`
            Die angegebene Adresse "${address}" von der Location "${name}" konnte leider nicht gefunden werden.
            Ist sie korrekt? Füg alternativ direkt die passenden Koordinaten im CMS ein.
        `);
    } else {
        addLookUpHint(`
            Zu der Location "${name}" wurden die Koordinaten ${resultCoordinates.latitude},${resultCoordinates.longitude} ermittelt.
            Prüfe bitte auf der Karte, ob diese stimmen und hinterlege sie dann im CMS, damit wir diese nicht stets ermitteln müssen <3
        `);
    }

    return resultCoordinates;
};

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

                const locationNameForGeoCoding = groupOfLocation?.attributes.Name ?? location.attributes.Name;

                const latLng = await getLocationCoordinates(
                    locationNameForGeoCoding,
                    location.attributes.Address,
                    location.attributes.Coordinates,
                    addLookUpHint
                );

                if (latLng !== null) {
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
                }
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <div className="mb-3">
            <MapContainer
                center={{ lat: 51.9511154, lng: 7.6418614 }}
                zoom={14}
                scrollWheelZoom={true}
                className="h-[400px]"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapMarkers.map(mapMarker => (
                    <Marker
                        key={mapMarker.locationId}
                        position={{ lat: mapMarker.latitude, lng: mapMarker.longitude }}
                    >
                        <Popup>
                            {mapMarker.name}
                            {mapMarker.address === null ? '' : <><br />{mapMarker.address}</>}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {coordinateLookUpHints.length > 0 && (
                <div className="mt-3 space-y-3">
                    {coordinateLookUpHints.map(hint => (
                        <Alert key={hint} severity="info">
                            {hint}
                        </Alert>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationsMap;
