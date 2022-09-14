import { toNumber } from 'lodash';
import type Coordinates from 'lib/locations/map/Coordinates';
import type PositionStackForwardResponse from 'lib/locations/map/PositionStackForwardResponse';

const getLocationCoordinates = async (
    locationName: string,
    locationGroupName: string | null,
    address: string | null,
    coordinates: string | null,
    addLookUpHint: (hint: string) => void
): Promise<Coordinates | null> => {

    if (coordinates !== '' && coordinates !== null) {
        const splitCoords = coordinates.split(',');

        if (splitCoords.length !== 2) {
            addLookUpHint(`Die Koordinaten "${coordinates}" für die Location "${locationName}" haben ein unerwartetes Format`);
            return null;
        }

        const latitude = toNumber(splitCoords[0]);
        const longitude = toNumber(splitCoords[1]);

        if (isNaN(latitude) || isNaN(longitude)) {
            addLookUpHint(`Die Koordinaten "${coordinates}" für die Location "${locationName}" haben ein unerwartetes Format`);
            return null;
        }

        return { latitude, longitude };
    }

    if (address === null || address === '') {
        addLookUpHint(`Für die Location "${locationName}" fehlen noch Adresse und Koordinaten`);

        return null;
    }

    const apiKey = '09514e10a70fd729688307dac11a8ffa';

    const locationNameForGeoCoding = locationGroupName ?? locationName;
    const url = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${locationNameForGeoCoding},${address}`;

    const response = await fetch(url);

    const result: PositionStackForwardResponse = await response.json();

    const resultCoordinates = result.data[0] ?? null;

    if (resultCoordinates === null) {
        addLookUpHint(`
            Die angegebene Adresse "${address}" von der Location "${locationName}" konnte leider nicht gefunden werden.
            Ist sie korrekt? Füg alternativ direkt die passenden Koordinaten im CMS ein.
        `);
    } else {
        addLookUpHint(`
            Zu der Location "${locationName}" wurden die Koordinaten ${resultCoordinates.latitude},${resultCoordinates.longitude} ermittelt.
            Prüfe bitte auf der Karte, ob diese stimmen und hinterlege sie dann im CMS, damit wir diese nicht stets ermitteln müssen <3
        `);
    }

    return resultCoordinates;
};

export default getLocationCoordinates;
