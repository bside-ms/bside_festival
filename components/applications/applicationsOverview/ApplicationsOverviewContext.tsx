'use client';

import { typesFilterQueryName } from '@/lib/applications/filterQueryNames';
import isEmptyString from '@/lib/common/helper/isEmptyString';
import useEffectOnMount from '@/lib/common/hooks/useEffectOnMount';
import isValidType from '@/lib/participants/isValidType';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { Genre, Link, ParticipantGenre, Type, Zipcode } from '@prisma/client';
import Fuse from 'fuse.js';
import { xor } from 'lodash';
import type { Dispatch, PropsWithChildren, ReactElement, SetStateAction } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ApplicationsOverviewContextData {
    allApplications: Array<SerializableParticipant>;
    filteredApplications: Array<SerializableParticipant>;
    participantGenres: Array<ParticipantGenre>;
    searchText: string | null;
    setSearchText: Dispatch<SetStateAction<string | null>>;
    enhancedApplicationIds: Array<number>;
    toggleEnhancedApplicationId: (id: number) => void;
    getLinksOfApplication: (id: number) => Array<Link>;
    getZipcodesOfApplication: (id: number) => Array<Zipcode>;
    filteredTypes: Array<Type>;
    toggleFilteredType: (type: Type) => void;
    allGenres: Array<Genre & { count: 0 }>;
}

const ApplicationsOverviewContext = createContext<ApplicationsOverviewContextData | null>(null);

interface Props extends PropsWithChildren {
    applications: Array<SerializableParticipant>;
    participantGenres: Array<ParticipantGenre>;
    allLinks: Array<Link>;
    allZipcodes: Array<Zipcode>;
    allGenres: Array<Genre>;
}

const ApplicationsOverviewContextProvider = ({
    applications,
    participantGenres,
    allLinks,
    allZipcodes,
    allGenres,
    children,
}: Props): ReactElement => {
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
            isCaseSensitive: false,
            findAllMatches: true,
        });

        return fuse.search(searchText).map((result) => result.item);
    }, [applications, filteredTypes, searchText]);

    const [enhancedApplicationIds, setEnhancedApplicationIds] = useState<Array<number>>([]);

    const toggleEnhancedApplicationId = useCallback((id: number) => {
        setEnhancedApplicationIds((enhancedIds) => xor(enhancedIds, [id]));
    }, []);

    const toggleFilteredType = useCallback((type: Type) => {
        setFilteredTypes((types) => xor(types, [type]));
    }, []);

    const getLinksOfApplication = useCallback((id: number) => allLinks.filter(({ participantId }) => participantId === id), [allLinks]);

    const getZipcodesOfApplication = useCallback(
        (id: number) => allZipcodes.filter(({ participantId }) => participantId === id),
        [allZipcodes],
    );

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
                getZipcodesOfApplication,
                filteredTypes,
                toggleFilteredType,
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
