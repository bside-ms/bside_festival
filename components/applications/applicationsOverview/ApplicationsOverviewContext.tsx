import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Link, Type } from '@prisma/client';
import Fuse from 'fuse.js';
import type { Dispatch, PropsWithChildren, ReactElement, SetStateAction } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import isValidType from 'lib/participants/isValidType';
import type { SerializableParticipant } from 'pages/bewerbungen/[idAndName]';

interface ApplicationsOverviewContextData {
    allApplications: Array<SerializableParticipant>;
    filteredApplications: Array<SerializableParticipant>;
    searchText: string | null;
    setSearchText: Dispatch<SetStateAction<string | null>>;
    enhancedApplicationIds: Array<number>;
    toggleEnhancedApplicationId: (id: number) => void;
    getLinksOfApplication: (id: number) => Array<Link>;
    filteredTypes: Array<Type>;
    toggleFilteredType: (type: Type) => void;
}

const ApplicationsOverviewContext = createContext<ApplicationsOverviewContextData | null>(null);

interface Props extends PropsWithChildren {
    applications: Array<SerializableParticipant>;
    allLinks: Array<Link>;
}

const ApplicationsOverviewContextProvider = ({ applications, allLinks, children }: Props): ReactElement => {

    const [searchText, setSearchText] = useState<string | null>(null);

    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>([]);

    useEffectOnMount(() => {

        const queryParams = new URLSearchParams(window.location.search);

        const initialTypes = queryParams.get('types')?.split(',') ?? [];

        setFilteredTypes(initialTypes.filter(isValidType));
    });

    const filteredApplications = useMemo<Array<SerializableParticipant>>(() => {

        const applicationsFilteredByType = applications.filter(
            application => filteredTypes.length === 0 || filteredTypes.includes(application.type)
        );

        if (isEmptyString(searchText)) {
            return applicationsFilteredByType;
        }

        const fuse = new Fuse(
            applicationsFilteredByType,
            {
                keys: ['name'],
                shouldSort: true,
            }
        );

        return fuse.search(searchText).map(result => result.item);
    }, [applications, filteredTypes, searchText]);

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

    return (
        <ApplicationsOverviewContext.Provider
            value={{
                allApplications: applications,
                filteredApplications,
                searchText,
                setSearchText,
                enhancedApplicationIds,
                toggleEnhancedApplicationId,
                getLinksOfApplication,
                filteredTypes,
                toggleFilteredType,
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
