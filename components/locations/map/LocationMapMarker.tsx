import type { ReactElement } from 'react';
import { Marker } from 'react-leaflet';
import LocationMapMarkerPopUp from 'components/locations/map/LocationMapMarkerPopUp';
import type LocationMarker from 'lib/locations/map/LocationMarker';

interface Props {
    mapMarker: LocationMarker;
}

const LocationMapMarker = ({ mapMarker }: Props): ReactElement => {

    return (
        <Marker
            key={mapMarker.locationId}
            position={{ lat: mapMarker.latitude, lng: mapMarker.longitude }}
        >
            <LocationMapMarkerPopUp mapMarker={mapMarker} />
        </Marker>
    );
};

export default LocationMapMarker;
