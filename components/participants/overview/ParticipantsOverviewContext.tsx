import { createContext, useCallback, useContext, useState } from 'react';
import type { Link, Location, Participant, ParticipantLabel, Type, Venue } from '@prisma/client';
import { uniq } from 'lodash';
import type { PropsWithChildren, ReactElement } from 'react';
import { locationsFilterQueryName } from 'components/participants/overview/ParticipantsOverviewLocationFilter';
import { typesFilterQueryName } from 'components/participants/overview/ParticipantsOverviewTypesFilter';
import availableTypes from 'lib/applications/availableTypes';
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
    updateParticipant: (participant: Participant) => void;
    updateAllSlots: (allSlots: Array<SerializableSlot>) => void;
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

    useEffectOnMount(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const initialTypes = queryParams.get(typesFilterQueryName)?.split(',') ?? [];
        setFilteredTypes(initialTypes.filter(isValidType));

        const initialLocations = queryParams.get(locationsFilterQueryName)?.split(',') ?? [];
        setFilteredLocationIds(initialLocations.map(Number));
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
                updateParticipant,
                slots: slots.filter((slot) => filteredLocationIds.length === 0 || filteredLocationIds.includes(slot.locationId)),
                venues: venues.filter((venue) => filteredLocationIds.length === 0 || filteredLocationIds.includes(venue.locationId)),
                allLocations,
                updateAllSlots,
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
