'use client';

import isEmptyString from '@/lib/common/helper/isEmptyString';
import useEffectOnMount from '@/lib/common/hooks/useEffectOnMount';
import type { KeycloakUser } from '@/lib/keycloak/getKeycloakUsers';
import isValidType from '@/lib/participants/isValidType';
import statusOrder from '@/lib/participants/status/statusOrder';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ApplicationStatus, Genre, Link, ParticipantGenre, Type, Zipcode } from '@prisma/client';
import Fuse from 'fuse.js';
import { xor } from 'lodash';
import type { Dispatch, PropsWithChildren, ReactElement, SetStateAction } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface InternWorkspaceContextData {
    allApplications: Array<SerializableParticipant>;
    allGenres: Array<Genre>;
    availableOrganizers: Array<KeycloakUser>;
    collapsedStatusGroups: Array<ApplicationStatus>;
    expandedIds: Array<number>;
    filteredApplications: Array<SerializableParticipant>;
    filteredStatuses: Array<ApplicationStatus>;
    filteredTypes: Array<Type>;
    currentOrganizerUserId: string | null;
    onlyMyOrganizerAssignments: boolean;
    getGenres: (id: number) => Array<Genre>;
    getLinks: (id: number) => Array<Link>;
    getZipcodes: (id: number) => Array<Zipcode>;
    searchText: string | null;
    setSearchText: Dispatch<SetStateAction<string | null>>;
    toggleExpanded: (id: number) => void;
    toggleFilteredStatus: (status: ApplicationStatus) => void;
    toggleFilteredType: (type: Type) => void;
    toggleOnlyMyOrganizerAssignments: () => void;
    toggleStatusGroup: (status: ApplicationStatus) => void;
}

const InternWorkspaceContext = createContext<InternWorkspaceContextData | null>(null);

interface Props extends PropsWithChildren {
    allGenres: Array<Genre>;
    allLinks: Array<Link>;
    allZipcodes: Array<Zipcode>;
    applications: Array<SerializableParticipant>;
    availableOrganizers: Array<KeycloakUser>;
    currentOrganizerUserId: string | null;
    participantGenres: Array<ParticipantGenre>;
}

const initialCollapsedStatuses = new Array<ApplicationStatus>('Confirmed', 'Rejected', 'Canceled');

const InternWorkspaceContextProvider = ({
    allGenres,
    allLinks,
    allZipcodes,
    applications,
    availableOrganizers,
    children,
    currentOrganizerUserId,
    participantGenres,
}: Props): ReactElement => {
    const [searchText, setSearchText] = useState<string | null>(null);
    const [filteredTypes, setFilteredTypes] = useState<Array<Type>>([]);
    const [filteredStatuses, setFilteredStatuses] = useState<Array<ApplicationStatus>>([]);
    const [onlyMyOrganizerAssignments, setOnlyMyOrganizerAssignments] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Array<number>>([]);
    const [collapsedStatusGroups, setCollapsedStatusGroups] = useState<Array<ApplicationStatus>>(initialCollapsedStatuses);

    useEffectOnMount(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const expandedId = Number(queryParams.get('expand'));
        const initialTypes = queryParams.get('types')?.split(',') ?? [];

        setFilteredTypes(initialTypes.filter(isValidType));

        if (Number.isInteger(expandedId) && expandedId > 0) {
            setExpandedIds([expandedId]);
            window.setTimeout(() => document.getElementById(`intern-application-${expandedId}`)?.scrollIntoView({ block: 'start' }), 100);
        }
    });

    const filteredApplications = useMemo<Array<SerializableParticipant>>(() => {
        const filteredByChips = applications.filter(
            (application) =>
                (filteredTypes.length === 0 || filteredTypes.includes(application.type)) &&
                (filteredStatuses.length === 0 || filteredStatuses.includes(application.status)) &&
                (!onlyMyOrganizerAssignments ||
                    (currentOrganizerUserId !== null &&
                        application.organizers.some(({ organizerUserId }) => organizerUserId === currentOrganizerUserId))),
        );

        if (isEmptyString(searchText)) {
            return filteredByChips;
        }

        const fuse = new Fuse(filteredByChips, {
            findAllMatches: true,
            includeMatches: true,
            includeScore: true,
            isCaseSensitive: false,
            keys: ['name', 'description', 'contactName'],
            shouldSort: true,
        });

        return fuse.search(searchText).map((result) => result.item);
    }, [applications, currentOrganizerUserId, filteredStatuses, filteredTypes, onlyMyOrganizerAssignments, searchText]);

    const getGenres = useCallback(
        (id: number) => {
            const ownParticipantGenreIds = participantGenres.filter((genre) => genre.participantId === id).map((genre) => genre.genreId);

            return allGenres.filter((genre) => ownParticipantGenreIds.includes(genre.id));
        },
        [allGenres, participantGenres],
    );

    const getLinks = useCallback((id: number) => allLinks.filter(({ participantId }) => participantId === id), [allLinks]);
    const getZipcodes = useCallback((id: number) => allZipcodes.filter(({ participantId }) => participantId === id), [allZipcodes]);
    const toggleExpanded = useCallback((id: number) => setExpandedIds((ids) => xor(ids, [id])), []);
    const toggleFilteredType = useCallback((type: Type) => setFilteredTypes((types) => xor(types, [type])), []);
    const toggleFilteredStatus = useCallback((status: ApplicationStatus) => setFilteredStatuses((statuses) => xor(statuses, [status])), []);
    const toggleOnlyMyOrganizerAssignments = useCallback(() => setOnlyMyOrganizerAssignments((isActive) => !isActive), []);
    const toggleStatusGroup = useCallback(
        (status: ApplicationStatus) => setCollapsedStatusGroups((statuses) => xor(statuses, [status])),
        [],
    );

    return (
        <InternWorkspaceContext.Provider
            value={{
                allApplications: applications,
                allGenres,
                availableOrganizers,
                collapsedStatusGroups,
                currentOrganizerUserId,
                expandedIds,
                filteredApplications,
                filteredStatuses,
                filteredTypes,
                onlyMyOrganizerAssignments,
                getGenres,
                getLinks,
                getZipcodes,
                searchText,
                setSearchText,
                toggleExpanded,
                toggleFilteredStatus,
                toggleFilteredType,
                toggleOnlyMyOrganizerAssignments,
                toggleStatusGroup,
            }}
        >
            {children}
        </InternWorkspaceContext.Provider>
    );
};

const useInternWorkspaceContext = (): InternWorkspaceContextData => {
    const context = useContext(InternWorkspaceContext);

    if (context === null) {
        throw new Error('useInternWorkspaceContext must only be used within InternWorkspaceContextProvider.');
    }

    return context;
};

export { InternWorkspaceContextProvider, statusOrder, useInternWorkspaceContext };
