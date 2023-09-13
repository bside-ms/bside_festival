import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Label, Link, Participant, ParticipantLabel, Type } from '@prisma/client';
import Fuse from 'fuse.js';
import type { Dispatch, PropsWithChildren, ReactElement, SetStateAction } from 'react';
import { typesFilterQueryName } from 'components/participants/overview/ParticipantsOverviewTypesFilter';
import isEmptyString from 'lib/common/helper/isEmptyString';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import isValidType from 'lib/participants/isValidType';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface ApplicationsOverviewContextData {
    allApplications: Array<SerializableParticipant>;
    filteredApplications: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    updateParticipantLabels: (participantLabels: Array<ParticipantLabel>) => void;
    searchText: string | null;
    setSearchText: Dispatch<SetStateAction<string | null>>;
    enhancedApplicationIds: Array<number>;
    toggleEnhancedApplicationId: (id: number) => void;
    getLinksOfApplication: (id: number) => Array<Link>;
    filteredTypes: Array<Type>;
    toggleFilteredType: (type: Type) => void;
    updateApplication: (application: Participant) => void;
    allLabels: Array<Label & { count: 0 }>;
    updateAllLabels: (allLabels: Array<Label>) => void;
    filteredLabelIds: Array<number>;
    toggleFilteredLabelId: (labelId: number) => void;
    filteredMinimumScore: number | null;
    setFilteredMinimumScore: (score: number | null) => void;
}

const ApplicationsOverviewContext = createContext<ApplicationsOverviewContextData | null>(null);

interface Props extends PropsWithChildren {
    applications: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLabels: Array<Label>;
}

const ApplicationsOverviewContextProvider = ({
    applications: initialApplications,
    participantLabels: initialParticipantLabels,
    allLinks,
    allLabels: initialAllLabels,
    children,
}: Props): ReactElement => {
    const [allLabels, setAllLabels] = useState<Array<Label>>(initialAllLabels);

    const [participantLabels, setParticipantLabels] = useState<Array<ParticipantLabel>>(initialParticipantLabels);

    const [applications, setApplications] = useState<Array<SerializableParticipant>>(initialApplications);

    const [searchText, setSearchText] = useState<string | null>(null);

    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>([]);

    const [filteredMinimumScore, setFilteredMinimumScore] = useState<number | null>(null);

    const [filteredLabelIds, setFilteredLabelIds] = useState<Array<number>>([]);

    useEffectOnMount(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const initialTypes = queryParams.get(typesFilterQueryName)?.split(',') ?? [];

        setFilteredTypes(initialTypes.filter(isValidType));
    });

    const filteredApplications = useMemo<Array<SerializableParticipant>>(() => {
        const applicationsFilteredByType = applications.filter((application) => {
            const participantLabelIds = participantLabels
                .filter(({ participantId }) => participantId === application.id)
                .map(({ labelId }) => labelId);

            return (
                (filteredTypes.length === 0 || filteredTypes.includes(application.type)) &&
                (filteredMinimumScore === null ||
                    (application.curationScore !== null && application.curationScore >= filteredMinimumScore)) &&
                (filteredLabelIds.length === 0 || participantLabelIds.some((id) => filteredLabelIds.includes(id)))
            );
        });

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
    }, [applications, filteredLabelIds, filteredMinimumScore, filteredTypes, participantLabels, searchText]);

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

    const handleLabelFilterClick = useCallback((labelId: number) => {
        setFilteredLabelIds((prevState) => {
            if (prevState.includes(labelId)) {
                return prevState.filter((id) => id !== labelId);
            }

            return [...prevState, labelId];
        });
    }, []);

    return (
        <ApplicationsOverviewContext.Provider
            value={{
                allApplications: applications,
                participantLabels,
                updateParticipantLabels: setParticipantLabels,
                filteredApplications,
                searchText,
                setSearchText,
                enhancedApplicationIds,
                toggleEnhancedApplicationId,
                getLinksOfApplication,
                filteredTypes,
                toggleFilteredType,
                updateApplication,
                allLabels: allLabels.map((label) => ({ ...label, count: 0 })),
                updateAllLabels: setAllLabels,
                filteredLabelIds,
                toggleFilteredLabelId: handleLabelFilterClick,
                filteredMinimumScore,
                setFilteredMinimumScore,
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
