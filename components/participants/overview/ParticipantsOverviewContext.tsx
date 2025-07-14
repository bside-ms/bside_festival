'use client';

import availableTypes from '@/lib/applications/availableTypes';
import { pinnedParticipantsCookieName, readCookie, setCookie } from '@/lib/applications/cookies';
import formatDate from '@/lib/common/helper/formatDate';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import useEffectOnMount from '@/lib/common/hooks/useEffectOnMount';
import isValidType from '@/lib/participants/isValidType';
import serializeParticipant from '@/lib/participants/serializeParticipant';
import AllAttendees from '@/typings/AllAttendees';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { SerializableSlot } from '@/typings/SerializableSlot';
import type { Attendee, Genre, Link, Location, Participant, ParticipantGenre, ParticipantLabel, Type, Venue } from '@prisma/client';
import { addHours, endOfHour, isAfter, isBefore, isSameMinute, startOfHour, subHours } from 'date-fns';
import Fuse from 'fuse.js';
import { first, last, uniq } from 'lodash';
import { createContext, PropsWithChildren, ReactElement, useCallback, useContext, useMemo, useState } from 'react';

interface ParticipantsOverviewContextData {
    allParticipants: Array<SerializableParticipant>;
    slots: Array<SerializableSlot>;
    venues: Array<Venue>;
    allLocations: Array<Location>;
    filteredParticipants: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    updateParticipantLabels: (participantLabels: Array<ParticipantLabel>) => void;
    pinnedParticipantIds: Array<number>;
    togglePinnedParticipantId: (id: number) => void;
    getLinksOfParticipant: (id: number) => Array<Link>;
    actuallyAvailableTypes: Array<Type>;
    filteredText: string | null;
    setFilteredText: (text: string | null) => void;
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
    venuesDateRange: [Date, Date] | null;
    areLocationOrDateRangeFiltersSet: boolean;
    areFiltersSet: boolean;
    isInDataPrivacyGroup: boolean;
    participantGenres: Array<ParticipantGenre>;
    allGenres: Array<Genre & { count: 0 }>;
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
    isInDataPrivacyGroup: boolean;
    initialDateRangeDateRangeFilter: string | undefined;
    initialTypesFilter: string | undefined;
    initialLocationsFilter: string | undefined;
    initialTextFilter: string | undefined;
    participantGenres: Array<ParticipantGenre>;
    allGenres: Array<Genre>;
}

export const ParticipantsOverviewContextProvider = ({
    participants: initialParticipants,
    participantLabels: initialParticipantLabels,
    allLinks,
    slots: initialSlots,
    venues: initialVenues,
    allAttendees: initialAllAttendees,
    allLocations,
    isInDataPrivacyGroup,
    initialDateRangeDateRangeFilter,
    initialTypesFilter,
    initialLocationsFilter,
    initialTextFilter,
    participantGenres,
    allGenres,
    children,
}: Props): ReactElement => {
    const [participantLabels, setParticipantLabels] = useState<Array<ParticipantLabel>>(initialParticipantLabels);

    const [participants, setParticipants] = useState<Array<SerializableParticipant>>(initialParticipants);

    const [slots, setSlots] = useState<Array<SerializableSlot>>(initialSlots);
    const [venues, setVenues] = useState<Array<Venue>>(initialVenues);
    const [allAttendees, setAllAttendees] = useState<Array<AllAttendees>>(initialAllAttendees);

    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>((initialTypesFilter?.split(',') ?? []).filter(isValidType));

    const [filteredText, setFilteredText] = useState<string | null>(initialTextFilter ?? null);

    const [filteredLocationIds, setFilteredLocationIds] = useState<Array<number>>((initialLocationsFilter?.split(',') ?? []).map(Number));

    const earliestSlot = first(slots);
    const latestSlot = last(slots);
    const timeBufferInHours = 2;
    const earliestBegin = earliestSlot === undefined ? null : startOfHour(subHours(new Date(earliestSlot.begin), timeBufferInHours));
    const latestBegin =
        latestSlot === undefined ? null : startOfHour(addHours(endOfHour(addHours(new Date(latestSlot.begin), timeBufferInHours)), 1));

    const initialDateRange = initialDateRangeDateRangeFilter?.split(',') ?? [];
    let initialDateRangeValue: [number, number] | null = null;
    if (initialDateRange.length === 2 && !isNaN(Number(initialDateRange[0])) && !isNaN(Number(initialDateRange[1]))) {
        initialDateRangeValue = [Number(initialDateRange[0]), Number(initialDateRange[1])];
    } else if (earliestBegin !== null && latestBegin !== null && isAfter(new Date(), earliestBegin) && isBefore(new Date(), latestBegin)) {
        const aboutOneHourAgo = startOfHour(subHours(new Date(), 1));
        initialDateRangeValue = [Number(formatDate(aboutOneHourAgo, 'T')), Number(formatDate(latestBegin, 'T'))];
    }
    const [filteredDateRange, setFilteredDateRange] = useState<[number, number] | null>(initialDateRangeValue);

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

    const filteredParticipants = useMemo<Array<SerializableParticipant>>(() => {
        const participantsFilteredByType = participants.filter(
            (application) => filteredTypes.length === 0 || filteredTypes.includes(application.type),
        );

        if (isEmptyString(filteredText)) {
            return participantsFilteredByType;
        }

        const fuse = new Fuse(participantsFilteredByType, {
            keys: ['name', 'updatedName'],
            shouldSort: true,
            includeScore: true,
            includeMatches: true,
            minMatchCharLength: 3,
            isCaseSensitive: false,
            findAllMatches: true,
        });

        return fuse.search(filteredText).map((result) => result.item);
    }, [filteredText, participants, filteredTypes.length]);

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
                venuesDateRange: [new Date(`2025-09-19T12:00:00+02:00`), new Date(`2025-09-21T12:00:00+02:00`)],
                areLocationOrDateRangeFiltersSet: filteredLocationIds.length > 0 || filteredDateRange !== null,
                pinnedParticipantIds,
                togglePinnedParticipantId,
                areFiltersSet: filteredDateRange !== null || filteredTypes.length > 0 || filteredLocationIds.length > 0,
                isInDataPrivacyGroup,
                participantGenres,
                allGenres: allGenres.map((genre) => ({ ...genre, count: 0 })),
                filteredText,
                setFilteredText,
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
    dates: Array<Date>;
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
                dates:
                    venueItem.dates
                        ?.split(',')
                        .filter((date) => /\d{4}-\d{2}-\d{2}/.test(date))
                        .map((date) => new Date(`${date}T12:00:00+02:00`)) ?? [],
            };
        })
        .filter((venueItem): venueItem is ParticipantVenue => venueItem !== null);
};
