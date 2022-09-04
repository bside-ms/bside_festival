import type { ReactElement } from 'react';
import { Popup } from 'react-leaflet';
import LocationEditLink from 'components/locations/LocationEditLink';
import type LocationMarker from 'lib/locations/map/LocationMarker';

interface Props {
    mapMarker: LocationMarker;
}

const LocationMapMarkerPopUp = ({ mapMarker }: Props): ReactElement => {

    if (mapMarker.address === null) {
        return (
            <Popup>
                {mapMarker.name}
                <LocationEditLink locationId={mapMarker.locationId} />
            </Popup>
        );
    }

    return (
        <Popup>
            {mapMarker.name}<br />
            {mapMarker.address}
            <LocationEditLink locationId={mapMarker.locationId} />
        </Popup>
    );
};

export default LocationMapMarkerPopUp;
