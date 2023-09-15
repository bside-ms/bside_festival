import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Link, Location, Participant, ParticipantLabel, Type, Venue } from '@prisma/client';
import { addHours, endOfHour, isAfter, isBefore, isSameMinute, startOfHour, subHours } from 'date-fns';
import { first, last, uniq } from 'lodash';
import type { PropsWithChildren, ReactElement } from 'react';
import { dateRangeFilterQueryName } from 'components/participants/overview/ParticipantsOverviewDateRangeFilter';
import { locationsFilterQueryName } from 'components/participants/overview/ParticipantsOverviewLocationFilter';
import { typesFilterQueryName } from 'components/participants/overview/ParticipantsOverviewTypesFilter';
import availableTypes from 'lib/applications/availableTypes';
import formatDate from 'lib/common/helper/formatDate';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import isValidType from 'lib/participants/isValidType';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import type { SerializableSlot } from 'typings/SerializableSlot';

interface ParticipantsOverviewContextData {
    allParticipants: Array<SerializableParticipant>;
    slots: Array<SerializableSlot>;
    venues: Array<Venue>;
    allLocations: Array<Location>;
    filteredParticipants: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    updateParticipantLabels: (participantLabels: Array<ParticipantLabel>) => void;
    enhancedParticipantIds: Array<number>;
    toggleEnhancedParticipantId: (id: number) => void;
    getLinksOfParticipant: (id: number) => Array<Link>;
    actuallyAvailableTypes: Array<Type>;
    filteredTypes: Array<Type>;
    toggleFilteredType: (type: Type) => void;
    filteredLocationIds: Array<number>;
    toggleFilteredLocationId: (locationId: number) => void;
    filteredDateRange: [number, number] | null;
    setFilteredDateRange: (dateRange: [number, number] | null) => void;
    updateParticipant: (participant: Participant) => void;
    updateAllSlots: (allSlots: Array<SerializableSlot>) => void;
    slotsDateRange: [Date, Date] | null;
    areFiltersSet: boolean;
}

const ParticipantsOverviewContext = createContext<ParticipantsOverviewContextData | null>(null);

interface Props extends PropsWithChildren {
    participants: Array<SerializableParticipant>;
    slots: Array<SerializableSlot>;
    venues: Array<Venue>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLocations: Array<Location>;
}

const ParticipantsOverviewContextProvider = ({
    participants: initialParticipants,
    participantLabels: initialParticipantLabels,
    allLinks,
    slots: initialSlots,
    venues: initialVenues,
    allLocations,
    children,
}: Props): ReactElement => {
    const [participantLabels, setParticipantLabels] = useState<Array<ParticipantLabel>>(initialParticipantLabels);

    const [participants, setParticipants] = useState<Array<SerializableParticipant>>(initialParticipants);

    const [slots, setSlots] = useState<Array<SerializableSlot>>(initialSlots);

    const [venues, _setVenues] = useState<Array<Venue>>(initialVenues);

    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>([]);

    const [filteredLocationIds, setFilteredLocationIds] = useState<Array<number>>([]);

    const [filteredDateRange, setFilteredDateRange] = useState<[number, number] | null>(null);

    const [areFiltersSet, setAreFiltersSet] = useState(false);

    const earliestSlot = first(slots);
    const latestSlot = last(slots);
    const timeBufferInHours = 2;
    const earliestBegin = earliestSlot === undefined ? null : startOfHour(subHours(new Date(earliestSlot.begin), timeBufferInHours));
    const latestBegin =
        latestSlot === undefined ? null : startOfHour(addHours(endOfHour(addHours(new Date(latestSlot.begin), timeBufferInHours)), 1));

    useEffect(() => {
        // Filtered types are not relevant for this
        setAreFiltersSet(filteredLocationIds.length > 0 || filteredDateRange !== null);
    }, [filteredDateRange, filteredLocationIds.length, filteredTypes.length]);

    useEffectOnMount(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const initialTypes = queryParams.get(typesFilterQueryName)?.split(',') ?? [];
        setFilteredTypes(initialTypes.filter(isValidType));

        const initialLocations = queryParams.get(locationsFilterQueryName)?.split(',') ?? [];
        setFilteredLocationIds(initialLocations.map(Number));

        const initialDateRange = queryParams.get(dateRangeFilterQueryName)?.split(',') ?? [];
        if (initialDateRange.length === 2 && !isNaN(Number(initialDateRange[0])) && !isNaN(Number(initialDateRange[1]))) {
            setFilteredDateRange([Number(initialDateRange[0]), Number(initialDateRange[1])]);
        } else if (earliestBegin !== null && latestBegin !== null && isAfter(new Date(), earliestBegin)) {
            const aboutOneHourAgo = startOfHour(subHours(new Date(), 1));
            setFilteredDateRange([Number(formatDate(aboutOneHourAgo, 'T')), Number(formatDate(latestBegin, 'T'))]);
        }
    });

    const filteredParticipants = participants.filter(
        (participant) => filteredTypes.length === 0 || filteredTypes.includes(participant.type),
    );

    const [enhancedParticipantIds, setEnhancedParticipantIds] = useState<Array<number>>([]);

    const toggleEnhancedParticipantId = useCallback((id: number) => {
        setEnhancedParticipantIds((enhancedIds) => {
            if (enhancedIds.includes(id)) {
                return enhancedIds.filter((enhancedId) => enhancedId !== id);
            } else {
                return [...enhancedIds, id];
            }
        });
    }, []);

    const toggleFilteredType = useCallback((type: Type) => {
        setFilteredTypes((types) => {
            if (types.includes(type)) {
                return types.filter((filteredType) => filteredType !== type);
            } else {
                return [...types, type];
            }
        });
    }, []);

    const toggleFilteredLocationId = useCallback((locationId: number) => {
        setFilteredLocationIds((locationIds) => {
            if (locationIds.includes(locationId)) {
                return locationIds.filter((filteredLocationId) => filteredLocationId !== locationId);
            } else {
                return [...locationIds, locationId];
            }
        });
    }, []);

    const getLinksOfParticipant = useCallback((id: number) => allLinks.filter(({ participantId }) => participantId === id), [allLinks]);

    const updateParticipant = useCallback((participant: Participant) => {
        setParticipants((prevState) => {
            return prevState.map((participantItem) => {
                if (participantItem.id === participant.id) {
                    return serializeParticipant(participant);
                }

                return participantItem;
            });
        });
    }, []);

    const updateAllSlots = useCallback((allSlots: Array<SerializableSlot>): void => {
        setSlots(allSlots);
    }, []);

    const typesOfParticipants = uniq(participants.map(({ type }) => type));

    const actuallyAvailableTypes = availableTypes.filter((type) => typesOfParticipants.includes(type));

    return (
        <ParticipantsOverviewContext.Provider
            value={{
                allParticipants: participants,
                participantLabels,
                updateParticipantLabels: setParticipantLabels,
                filteredParticipants,
                enhancedParticipantIds,
                toggleEnhancedParticipantId,
                getLinksOfParticipant,
                actuallyAvailableTypes,
                filteredTypes,
                toggleFilteredType,
                filteredLocationIds,
                toggleFilteredLocationId,
                filteredDateRange,
                setFilteredDateRange,
                updateParticipant,
                slots: slots.filter((slot) => {
                    const matchesLocationFilter = filteredLocationIds.length === 0 || filteredLocationIds.includes(slot.locationId);

                    const slotBegin = new Date(slot.begin);
                    let matchesDateRangeFilter = true;
                    if (filteredDateRange !== null) {
                        const filteredBegin = new Date(filteredDateRange[0]);
                        const filteredEnd = new Date(filteredDateRange[1]);

                        matchesDateRangeFilter =
                            (isSameMinute(slotBegin, filteredBegin) || isAfter(slotBegin, filteredBegin)) &&
                            (isSameMinute(slotBegin, filteredEnd) || isBefore(slotBegin, filteredEnd));
                    }

                    return matchesLocationFilter && matchesDateRangeFilter;
                }),
                venues: venues.filter(
                    (venue) =>
                        (filteredLocationIds.length === 0 && filteredDateRange === null) || filteredLocationIds.includes(venue.locationId),
                ),
                allLocations,
                updateAllSlots,
                slotsDateRange: earliestBegin === null || latestBegin === null ? null : [earliestBegin, latestBegin],
                areFiltersSet,
            }}
        >
            {children}
        </ParticipantsOverviewContext.Provider>
    );
};

const useParticipantsOverviewContext = (): ParticipantsOverviewContextData => {
    const participantsOverviewContext = useContext(ParticipantsOverviewContext);

    if (participantsOverviewContext === null) {
        throw new Error('useParticipantsOverviewContext must only be used within corresponding provider!');
    }

    return participantsOverviewContext;
};

export interface ParticipantSlot {
    slot: SerializableSlot;
    location: Location;
}

export interface ParticipantVenue {
    venue: Venue;
    location: Location;
}

const useParticipantSlots = (participantId: number): Array<ParticipantSlot> => {
    const { allLocations, slots } = useParticipantsOverviewContext();

    return slots
        .filter((slotItem) => slotItem.participantId === participantId)
        .map<ParticipantSlot | null>((slotItem) => {
            const location = allLocations.find((locationItem) => locationItem.id === slotItem.locationId);

            if (location === undefined) {
                return null;
            }

            return {
                slot: slotItem,
                location,
            };
        })
        .filter((slotItem): slotItem is ParticipantSlot => slotItem !== null);
};

const useParticipantVenues = (participantId: number): Array<ParticipantVenue> => {
    const { allLocations, venues } = useParticipantsOverviewContext();

    return venues
        .filter((venueItem) => venueItem.participantId === participantId)
        .map<ParticipantVenue | null>((venueItem) => {
            const location = allLocations.find((locationItem) => locationItem.id === venueItem.locationId);

            if (location === undefined) {
                return null;
            }

            return {
                venue: venueItem,
                location,
            };
        })
        .filter((venueItem): venueItem is ParticipantVenue => venueItem !== null);
};

export { ParticipantsOverviewContextProvider, useParticipantsOverviewContext, useParticipantSlots, useParticipantVenues };
