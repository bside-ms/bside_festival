import { toNumber } from 'lodash';
import type Coordinates from 'lib/locations/map/Coordinates';
import type PositionStackForwardResponse from 'lib/locations/map/PositionStackForwardResponse';

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

export default getLocationCoordinates;
