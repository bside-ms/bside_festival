import { useParticipantsOverviewContext } from '@/components/participants/overview/ParticipantsOverviewContext';
import { locationsFilterQueryName } from '@/lib/applications/filterQueryNames';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import useIsMounted from '@/lib/common/hooks/useIsMounted';
import type { Location } from '@prisma/client';
import type { ReactElement } from 'react';
import { useCallback, useEffect } from 'react';

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

    const isActive = locations.every(({ id }) => filteredLocationIds.includes(id));

    return (
        <div
            className="rounded-2xl px-3 py-1 font-mono text-sm select-none hover:opacity-90 md:cursor-pointer"
            style={
                isActive
                    ? {
                          color: 'white',
                          backgroundColor: 'black',
                      }
                    : {
                          color: 'black',
                          backgroundColor: 'white',
                      }
            }
            onClick={handleClick}
        >
            {simplifyLocationName(locations[0]!.name)}
        </div>
    );
};

const LocationIdToggle = ({ locationId }: { locationId: number }): ReactElement | null => {
    const { filteredLocationIds, toggleFilteredLocationId, allLocations } = useParticipantsOverviewContext();

    const handleClick = useCallback(() => toggleFilteredLocationId(locationId), [locationId, toggleFilteredLocationId]);

    const isActive = filteredLocationIds.includes(locationId);

    const locationName = allLocations.find(({ id }) => id === locationId)?.name ?? `Ort #${locationId}`;

    return (
        <div
            className="rounded-2xl px-3 py-1 font-mono text-sm select-none hover:opacity-90 md:cursor-pointer"
            style={
                isActive
                    ? {
                          color: 'white',
                          backgroundColor: 'black',
                      }
                    : {
                          color: 'black',
                          backgroundColor: 'white',
                      }
            }
            onClick={handleClick}
        >
            {locationName}
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

    // Determine location IDs that are somehow set w/o their corresponding group
    let remainingFilteredLocationIds = filteredLocationIds;
    locationGroups.forEach((group) => {
        if (group.every(({ id }) => filteredLocationIds.includes(id))) {
            group.forEach(({ id }) => {
                remainingFilteredLocationIds = remainingFilteredLocationIds.filter((locationId) => locationId !== id);
            });
        }
    });

    return (
        <div className="mb-2 rounded-2xl border border-black bg-[#ebc9de]">
            <div className="border-b border-black p-2 text-center text-2xl uppercase">Location</div>

            <div className="flex flex-wrap gap-2 p-2">
                {locationGroups.map((locations) => (
                    <LocationGroupToggle key={locations[0]!.id} locations={locations} />
                ))}
                {remainingFilteredLocationIds.map((locationId) => (
                    <LocationIdToggle key={locationId} locationId={locationId} />
                ))}
            </div>
        </div>
    );
};

export default ParticipantsOverviewLocationFilter;
