import type { PropsWithChildren, ReactElement } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import type { Attendee, Link, Location, Participant, ParticipantLabel, Type, Venue } from '@prisma/client';
import { addHours, endOfHour, isAfter, isBefore, isSameMinute, startOfHour, subHours } from 'date-fns';
import { first, last, uniq } from 'lodash';
import { dateRangeFilterQueryName } from 'components/participants/overview/ParticipantsOverviewDateRangeFilter';
import { locationsFilterQueryName } from 'components/participants/overview/ParticipantsOverviewLocationFilter';
import { typesFilterQueryName } from 'components/participants/overview/ParticipantsOverviewTypesFilter';
import availableTypes from 'lib/applications/availableTypes';
import { pinnedParticipantsCookieName, readCookie, setCookie } from 'lib/applications/cookies';
import formatDate from 'lib/common/helper/formatDate';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import isValidType from 'lib/participants/isValidType';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import type { SerializableSlot } from 'typings/SerializableSlot';
import AllAttendees from 'typings/AllAttendees';

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
    pinnedParticipantIds: Array<number>;
    togglePinnedParticipantId: (id: number) => void;
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
    updateAllVenues: (allVenues: Array<Venue>) => void;
    allAttendees: Array<AllAttendees>;
    updateAllAttendees: (allAttendees: Array<AllAttendees>) => void;
    slotsDateRange: [Date, Date] | null;
    areLocationOrDateRangeFiltersSet: boolean;
}

const ParticipantsOverviewContext = createContext<ParticipantsOverviewContextData | null>(null);

interface Props extends PropsWithChildren {
    participants: Array<SerializableParticipant>;
    slots: Array<SerializableSlot>;
    venues: Array<Venue>;
    allAttendees: Array<AllAttendees>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLocations: Array<Location>;
}

export const ParticipantsOverviewContextProvider = ({
    participants: initialParticipants,
    participantLabels: initialParticipantLabels,
    allLinks,
    slots: initialSlots,
    venues: initialVenues,
    allAttendees: initialAllAttendees,
    allLocations,
    children,
}: Props): ReactElement => {
    const [participantLabels, setParticipantLabels] = useState<Array<ParticipantLabel>>(initialParticipantLabels);

    const [participants, setParticipants] = useState<Array<SerializableParticipant>>(initialParticipants);

    const [slots, setSlots] = useState<Array<SerializableSlot>>(initialSlots);
    const [venues, setVenues] = useState<Array<Venue>>(initialVenues);
    const [allAttendees, setAllAttendees] = useState<Array<AllAttendees>>(initialAllAttendees);

    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>([]);

    const [filteredLocationIds, setFilteredLocationIds] = useState<Array<number>>([]);

    const [filteredDateRange, setFilteredDateRange] = useState<[number, number] | null>(null);

    const earliestSlot = first(slots);
    const latestSlot = last(slots);
    const timeBufferInHours = 2;
    const earliestBegin = earliestSlot === undefined ? null : startOfHour(subHours(new Date(earliestSlot.begin), timeBufferInHours));
    const latestBegin =
        latestSlot === undefined ? null : startOfHour(addHours(endOfHour(addHours(new Date(latestSlot.begin), timeBufferInHours)), 1));

    useEffectOnMount(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const initialTypes = queryParams.get(typesFilterQueryName)?.split(',') ?? [];
        setFilteredTypes(initialTypes.filter(isValidType));

        const initialLocations = queryParams.get(locationsFilterQueryName)?.split(',') ?? [];
        setFilteredLocationIds(initialLocations.map(Number));

        const initialDateRange = queryParams.get(dateRangeFilterQueryName)?.split(',') ?? [];
        if (initialDateRange.length === 2 && !isNaN(Number(initialDateRange[0])) && !isNaN(Number(initialDateRange[1]))) {
            setFilteredDateRange([Number(initialDateRange[0]), Number(initialDateRange[1])]);
        } else if (
            earliestBegin !== null &&
            latestBegin !== null &&
            isAfter(new Date(), earliestBegin) &&
            isBefore(new Date(), latestBegin)
        ) {
            const aboutOneHourAgo = startOfHour(subHours(new Date(), 1));
            setFilteredDateRange([Number(formatDate(aboutOneHourAgo, 'T')), Number(formatDate(latestBegin, 'T'))]);
        }
    });

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

    const [pinnedParticipantIds, setPinnedParticipantIds] = useState<Array<number>>([]);

    const togglePinnedParticipantId = useCallback((participantId: number) => {
        setPinnedParticipantIds((prevPinnedParticipantIds) => {
            const newPinnedParticipantIds = prevPinnedParticipantIds.includes(participantId)
                ? prevPinnedParticipantIds.filter((enhancedId) => enhancedId !== participantId)
                : [...prevPinnedParticipantIds, participantId];

            setCookie(pinnedParticipantsCookieName, newPinnedParticipantIds.join(','));

            return newPinnedParticipantIds;
        });
    }, []);

    useEffectOnMount(() => {
        setPinnedParticipantIds(readCookie(pinnedParticipantsCookieName)?.split(',').map(Number) ?? []);
    });

    const filteredParticipants = participants.filter(
        (participant) => filteredTypes.length === 0 || filteredTypes.includes(participant.type),
    );

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

    const updateAllSlots = useCallback((allSlots: Array<SerializableSlot>): void => setSlots(allSlots), []);

    const updateAllVenues = useCallback((allVenues: Array<Venue>): void => setVenues(allVenues), []);

    const updateAllAttendees = useCallback((allAttendees: Array<AllAttendees>): void => setAllAttendees(allAttendees), []);

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
                    if (filteredLocationIds.length > 0 && !filteredLocationIds.includes(slot.locationId)) {
                        return false;
                    }

                    if (filteredDateRange === null) {
                        return true;
                    }

                    const slotBegin = new Date(slot.begin);

                    const filteredBegin = new Date(filteredDateRange[0]);
                    const filteredEnd = new Date(filteredDateRange[1]);

                    return (
                        (isSameMinute(slotBegin, filteredBegin) || isAfter(slotBegin, filteredBegin)) &&
                        (isSameMinute(slotBegin, filteredEnd) || isBefore(slotBegin, filteredEnd))
                    );
                }),
                venues: venues.filter(
                    (venue) =>
                        filteredDateRange === null && (filteredLocationIds.length === 0 || filteredLocationIds.includes(venue.locationId)),
                ),
                allLocations,
                updateAllSlots,
                updateAllVenues,
                allAttendees,
                updateAllAttendees,
                slotsDateRange: earliestBegin === null || latestBegin === null ? null : [earliestBegin, latestBegin],
                areLocationOrDateRangeFiltersSet: filteredLocationIds.length > 0 || filteredDateRange !== null,
                pinnedParticipantIds,
                togglePinnedParticipantId,
            }}
        >
            {children}
        </ParticipantsOverviewContext.Provider>
    );
};

export const useParticipantsOverviewContext = (): ParticipantsOverviewContextData => {
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

interface ParticipantVenue {
    venue: Venue;
    location: Location;
}

export const useSlotAttendees = (slotId: number): Array<Omit<Attendee, 'attendedAt'>> => {
    const { allAttendees } = useParticipantsOverviewContext();

    return allAttendees.find((slot) => slot.slotId === slotId)?.attendees ?? [];
};

export const useParticipantSlots = (participantId: number): Array<ParticipantSlot> => {
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

export const useParticipantVenues = (participantId: number): Array<ParticipantVenue> => {
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
