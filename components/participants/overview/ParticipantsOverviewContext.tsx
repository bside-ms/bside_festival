import { createContext, useCallback, useContext, useState } from 'react';
import type { Link, Location, Participant, ParticipantLabel, Type } from '@prisma/client';
import type { PropsWithChildren, ReactElement } from 'react';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import isValidType from 'lib/participants/isValidType';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface ParticipantsOverviewContextData {
    allParticipants: Array<SerializableParticipant>;
    filteredParticipants: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    updateParticipantLabels: (participantLabels: Array<ParticipantLabel>) => void;
    enhancedParticipantIds: Array<number>;
    toggleEnhancedParticipantId: (id: number) => void;
    getLinksOfParticipant: (id: number) => Array<Link>;
    filteredTypes: Array<Type>;
    toggleFilteredType: (type: Type) => void;
    updateParticipant: (participant: Participant) => void;
}

const ParticipantsOverviewContext = createContext<ParticipantsOverviewContextData | null>(null);

interface Props extends PropsWithChildren {
    participants: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLocations: Array<Location>;
}

const ParticipantsOverviewContextProvider = ({
    participants: initialParticipants,
    participantLabels: initialParticipantLabels,
    allLinks,
    allLocations,
    children,
}: Props): ReactElement => {

    const [participantLabels, setParticipantLabels] = useState<Array<ParticipantLabel>>(initialParticipantLabels);

    const [participants, setParticipants] = useState<Array<SerializableParticipant>>(initialParticipants);

    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>([]);

    useEffectOnMount(() => {

        const queryParams = new URLSearchParams(window.location.search);

        const initialTypes = queryParams.get('types')?.split(',') ?? [];

        setFilteredTypes(initialTypes.filter(isValidType));
    });

    const filteredParticipants = participants.filter(
        participant => filteredTypes.length === 0 || filteredTypes.includes(participant.type)
    );

    const [enhancedParticipantIds, setEnhancedParticipantIds] = useState<Array<number>>([]);

    const toggleEnhancedParticipantId = useCallback((id: number) => {

        setEnhancedParticipantIds(enhancedIds => {
            if (enhancedIds.includes(id)) {
                return enhancedIds.filter(enhancedId => enhancedId !== id);
            } else {
                return [...enhancedIds, id];
            }
        });
    }, []);

    const toggleFilteredType = useCallback((type: Type) => {

        setFilteredTypes(types => {
            if (types.includes(type)) {
                return types.filter(filteredType => filteredType !== type);
            } else {
                return [...types, type];
            }
        });
    }, []);

    const getLinksOfParticipant = useCallback((id: number) => (
        allLinks.filter(({ participantId }) => participantId === id)
    ), [allLinks]);

    const updateParticipant = useCallback((participant: Participant) => {

        setParticipants(prevState => {

            return prevState
                .map(participantItem => {

                    if (participantItem.id === participant.id) {
                        return serializeParticipant(participant);
                    }

                    return participantItem;
                });
        });

    }, []);

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
                filteredTypes,
                toggleFilteredType,
                updateParticipant,
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

export {
    ParticipantsOverviewContextProvider,
    useParticipantsOverviewContext,
};
