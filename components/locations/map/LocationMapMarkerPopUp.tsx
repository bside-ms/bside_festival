import type { ReactElement } from 'react';
import { Popup } from 'react-leaflet';
import type LocationMarker from 'lib/locations/map/LocationMarker';

interface Props {
    mapMarker: LocationMarker;
}

const LocationMapMarkerPopUp = ({ mapMarker }: Props): ReactElement => {

    if (mapMarker.address === null) {
        return (
            <Popup>
                {mapMarker.name}
            </Popup>
        );
    }

    return (
        <Popup>
            {mapMarker.name}<br />
            {mapMarker.address}
        </Popup>
    );
};

export default LocationMapMarkerPopUp;
