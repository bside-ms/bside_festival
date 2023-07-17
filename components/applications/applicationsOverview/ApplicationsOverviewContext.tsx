import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Label, Link, Participant, ParticipantLabel, Type } from '@prisma/client';
import Fuse from 'fuse.js';
import { noop } from 'lodash';
import type { Dispatch, PropsWithChildren, ReactElement, SetStateAction } from 'react';
import serializeApplication from 'lib/applications/serializeApplication';
import isEmptyString from 'lib/common/helper/isEmptyString';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import isValidType from 'lib/participants/isValidType';
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
    toggleFilteredLabelId: (id: number) => void;
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

    useEffectOnMount(() => {

        const queryParams = new URLSearchParams(window.location.search);

        const initialTypes = queryParams.get('types')?.split(',') ?? [];

        setFilteredTypes(initialTypes.filter(isValidType));
    });

    const filteredApplications = useMemo<Array<SerializableParticipant>>(() => {

        const applicationsFilteredByType = applications.filter(
            application => (
                (filteredTypes.length === 0 || filteredTypes.includes(application.type)) &&
                (filteredMinimumScore === null || (application.curationScore !== null && application.curationScore >= filteredMinimumScore))
            )
        );

        if (isEmptyString(searchText)) {
            return applicationsFilteredByType;
        }

        const fuse = new Fuse(
            applicationsFilteredByType,
            {
                keys: ['name'],
                shouldSort: true,
                includeScore: true,
                includeMatches: true,
                minMatchCharLength: 3,
                isCaseSensitive: false,
                findAllMatches: true,
            }
        );

        return fuse.search(searchText).map(result => result.item);
    }, [applications, filteredMinimumScore, filteredTypes, searchText]);

    const [enhancedApplicationIds, setEnhancedApplicationIds] = useState<Array<number>>([]);

    const toggleEnhancedApplicationId = useCallback((id: number) => {

        setEnhancedApplicationIds(enhancedIds => {
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

    const getLinksOfApplication = useCallback((id: number) => (
        allLinks.filter(({ participantId }) => participantId === id)
    ), [allLinks]);

    const updateApplication = useCallback((application: Participant) => {

        setApplications(prevState => {

            return prevState
                .map(applicationItem => {

                    if (applicationItem.id === application.id) {
                        return serializeApplication(application);
                    }

                    return applicationItem;
                });
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
                allLabels: allLabels.map(label => ({ ...label, count: 0 })),
                updateAllLabels: setAllLabels,
                filteredLabelIds: [],
                toggleFilteredLabelId: noop,
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

export {
    ApplicationsOverviewContextProvider,
    useApplicationsOverviewContext,
};
