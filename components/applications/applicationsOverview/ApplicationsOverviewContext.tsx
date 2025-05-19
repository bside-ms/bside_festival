'use client';

import type { Genre, Link, Participant, ParticipantGenre, Type } from '@prisma/client';
import { typesFilterQueryName } from 'components/participants/overview/ParticipantsOverviewTypesFilter';
import Fuse from 'fuse.js';
import isEmptyString from 'lib/common/helper/isEmptyString';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import isValidType from 'lib/participants/isValidType';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { Dispatch, PropsWithChildren, ReactElement, SetStateAction } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface ApplicationsOverviewContextData {
    allApplications: Array<SerializableParticipant>;
    filteredApplications: Array<SerializableParticipant>;
    participantGenres: Array<ParticipantGenre>;
    searchText: string | null;
    setSearchText: Dispatch<SetStateAction<string | null>>;
    enhancedApplicationIds: Array<number>;
    toggleEnhancedApplicationId: (id: number) => void;
    getLinksOfApplication: (id: number) => Array<Link>;
    filteredTypes: Array<Type>;
    toggleFilteredType: (type: Type) => void;
    updateApplication: (application: Participant) => void;
    allGenres: Array<Genre & { count: 0 }>;
}

const ApplicationsOverviewContext = createContext<ApplicationsOverviewContextData | null>(null);

interface Props extends PropsWithChildren {
    applications: Array<SerializableParticipant>;
    participantGenres: Array<ParticipantGenre>;
    allLinks: Array<Link>;
    allGenres: Array<Genre>;
}

const ApplicationsOverviewContextProvider = ({
    applications: initialApplications,
    participantGenres,
    allLinks,
    allGenres,
    children,
}: Props): ReactElement => {
    const [applications, setApplications] = useState<Array<SerializableParticipant>>(initialApplications);

    const [searchText, setSearchText] = useState<string | null>(null);

    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>([]);

    useEffectOnMount(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const initialTypes = queryParams.get(typesFilterQueryName)?.split(',') ?? [];

        setFilteredTypes(initialTypes.filter(isValidType));
    });

    const filteredApplications = useMemo<Array<SerializableParticipant>>(() => {
        const applicationsFilteredByType = applications.filter(
            (application) => filteredTypes.length === 0 || filteredTypes.includes(application.type),
        );

        if (isEmptyString(searchText)) {
            return applicationsFilteredByType;
        }

        const fuse = new Fuse(applicationsFilteredByType, {
            keys: ['name'],
            shouldSort: true,
            includeScore: true,
            includeMatches: true,
            minMatchCharLength: 3,
            isCaseSensitive: false,
            findAllMatches: true,
        });

        return fuse.search(searchText).map((result) => result.item);
    }, [applications, filteredTypes, searchText]);

    const [enhancedApplicationIds, setEnhancedApplicationIds] = useState<Array<number>>([]);

    const toggleEnhancedApplicationId = useCallback((id: number) => {
        setEnhancedApplicationIds((enhancedIds) => {
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

    const getLinksOfApplication = useCallback((id: number) => allLinks.filter(({ participantId }) => participantId === id), [allLinks]);

    const updateApplication = useCallback((application: Participant) => {
        setApplications((prevState) => {
            return prevState.map((applicationItem) => {
                if (applicationItem.id === application.id) {
                    return serializeParticipant(application);
                }

                return applicationItem;
            });
        });
    }, []);

    return (
        <ApplicationsOverviewContext.Provider
            value={{
                allApplications: applications,
                participantGenres,
                filteredApplications,
                searchText,
                setSearchText,
                enhancedApplicationIds,
                toggleEnhancedApplicationId,
                getLinksOfApplication,
                filteredTypes,
                toggleFilteredType,
                updateApplication,
                allGenres: allGenres.map((genre) => ({ ...genre, count: 0 })),
            }}
        >
            {children}
        </ApplicationsOverviewContext.Provider>
    );
};

const useApplicationsOverviewContext = (): ApplicationsOverviewContextData => {
    const ApplicationsOverviewContextContext = useContext(ApplicationsOverviewContext);

    if (ApplicationsOverviewContextContext === null) {
        throw new Error('useApplicationsOverviewContext must only be used within corresponding provider!');
    }

    return ApplicationsOverviewContextContext;
};

export { ApplicationsOverviewContextProvider, useApplicationsOverviewContext };
