import type { ReactElement } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMapMarker from 'components/locations/map/LocationMapMarker';
import type LocationMarker from 'lib/locations/map/LocationMarker';

interface Props {
    mapMarkers: Array<LocationMarker>;
}

const coordsOfMuenster = { lat: 51.9511154, lng: 7.6418614 };

const LocationMapContainer = ({ mapMarkers }: Props): ReactElement => {

    return (
        <MapContainer
            center={coordsOfMuenster}
            zoom={14}
            scrollWheelZoom={true}
            className="h-[400px]"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {mapMarkers.map(mapMarker => (
                <LocationMapMarker
                    key={mapMarker.locationId}
                    mapMarker={mapMarker}
                />
            ))}
        </MapContainer>
    );
};

export default LocationMapContainer;
