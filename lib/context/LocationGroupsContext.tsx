import { createContext, useContext } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type Location from 'lib/strapi/typings/Location';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';

interface LocationGroupsContextData {
    locationGroups: Array<LocationGroup>;
}

const LocationGroupsContext = createContext<LocationGroupsContextData | null>(null);

interface Props {
    children: ReactNode;
    locationGroups: Array<LocationGroup>;
}

const LocationGroupsContextProvider = ({ locationGroups, children }: Props): ReactElement => (
    <LocationGroupsContext.Provider value={{ locationGroups }}>
        {children}
    </LocationGroupsContext.Provider>
);

const useLocationGroupsContext = (): LocationGroupsContextData => {

    const locationGroupsContext = useContext(LocationGroupsContext);

    if (locationGroupsContext === null) {
        throw new Error('useLocationGroupsContext must only be used within corresponding provider!');
    }

    return locationGroupsContext;
};

const getLocationGroupOfLocation = (locationGroups: Array<LocationGroup>, location: Location): LocationGroup | null => {

    const matchingLocationGroups = locationGroups.filter(
        locationGroup => locationGroup.attributes.locations.data.some(locationItem => locationItem.id === location.id)
    );

    if (matchingLocationGroups.length > 1) {
        // eslint-disable-next-line no-console
        console.error('A location must only be associated with one location group');
    }

    return matchingLocationGroups[0] ?? null;
};

const useLocationGroupOfLocation = (location: Location | null): LocationGroup | null => {

    const { locationGroups } = useLocationGroupsContext();

    if (location === null) {
        return null;
    }

    return getLocationGroupOfLocation(locationGroups, location);
};

const usePreferredLocationName = (location: Location | null): string | null => {

    const { locationGroups } = useLocationGroupsContext();

    if (location === null) {
        return null;
    }

    const locationGroupNameOfLocation = getLocationGroupOfLocation(locationGroups, location)?.attributes.Name ?? null;

    const locationName = location.attributes.Name;

    if (locationGroupNameOfLocation === null) {
        return locationName;
    }

    return locationGroupNameOfLocation;
};

export {
    LocationGroupsContextProvider,
    useLocationGroupsContext,
    getLocationGroupOfLocation,
    useLocationGroupOfLocation,
    usePreferredLocationName,
};
