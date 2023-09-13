import { useCallback, useEffect } from 'react';
import type { Location } from '@prisma/client';
import type { ReactElement } from 'react';
import { useParticipantsOverviewContext } from 'components/participants/overview/ParticipantsOverviewContext';
import isEmptyString from 'lib/common/helper/isEmptyString';
import useIsMounted from 'lib/common/hooks/useIsMounted';

export const locationsFilterQueryName = 'locations';

/**
 * Strips appendices in parens from location names.
 */
const simplifyLocationName = (locationName: string): string => locationName.replace(/\s\(.+\)$/, '');

const LocationGroupToggle = ({ locations }: { locations: Array<Location> }): ReactElement | null => {
    const { filteredLocationIds, toggleFilteredLocationId } = useParticipantsOverviewContext();

    const handleClick = useCallback(
        () => locations.forEach(({ id }) => toggleFilteredLocationId(id)),
        [locations, toggleFilteredLocationId],
    );

    const active = locations.every(({ id }) => filteredLocationIds.includes(id));

    return (
        <div
            className="select-none uppercase md:cursor-pointer rounded-2xl border-2 bg-gray-200 border-gray-200 border-dashed text-sm px-3 py-1"
            style={{ borderColor: active ? '#444' : undefined }}
            onClick={handleClick}
        >
            {simplifyLocationName(locations[0]!.name)}
        </div>
    );
};

const useLocationGroups = (): Array<Array<Location>> => {
    const { allLocations } = useParticipantsOverviewContext();

    return allLocations.reduce((locationGroups, location) => {
        const foundGroup = locationGroups.find((group) =>
            group.some(({ name }) => simplifyLocationName(name) === simplifyLocationName(location.name)),
        );

        if (foundGroup === undefined) {
            locationGroups.push([location]);
        } else {
            foundGroup.push(location);
        }

        return locationGroups;
    }, new Array<Array<Location>>());
};

const ParticipantsOverviewLocationFilter = (): ReactElement => {
    const locationGroups = useLocationGroups();

    const { filteredLocationIds } = useParticipantsOverviewContext();

    const isMounted = useIsMounted();

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        const currentUrl = new URL(window.location.href);

        const queryValue = filteredLocationIds.join(',');

        if (isEmptyString(queryValue)) {
            currentUrl.searchParams.delete(locationsFilterQueryName);
        } else {
            currentUrl.searchParams.set(locationsFilterQueryName, queryValue);
        }

        history.replaceState(null, '', currentUrl.toString());
    }, [isMounted, filteredLocationIds]);

    return (
        <div className="mb-3">
            <div className="mb-1 underline">Veranstaltungsort</div>
            <div className="flex flex-wrap gap-2 mb-3">
                {locationGroups.map((locations) => (
                    <LocationGroupToggle key={locations[0]!.id} locations={locations} />
                ))}
            </div>
        </div>
    );
};

export default ParticipantsOverviewLocationFilter;
