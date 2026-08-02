'use client';

import isEmptyString from '@/lib/common/helper/isEmptyString';
import { internFilterParsers, internFilterUrlOptions } from '@/lib/intern/internFilterSearchParams';
import matchesParticipantSearch from '@/lib/participants/matchesParticipantSearch';
import statusOrder from '@/lib/participants/status/statusOrder';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { ApplicationStatus, Genre, ParticipantGenre, Type } from '@prisma/client';
import { xor } from 'lodash';
import { useQueryStates } from 'nuqs';
import type { Dispatch, PropsWithChildren, ReactElement, SetStateAction } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface InternWorkspaceContextData {
    allApplications: Array<SerializableParticipant>;
    collapsedStatusGroups: Array<ApplicationStatus>;
    filteredApplications: Array<SerializableParticipant>;
    filteredStatuses: Array<ApplicationStatus>;
    filteredTypes: Array<Type>;
    currentOrganizerUserId: string | null;
    onlyMyOrganizerAssignments: boolean;
    onlyWithoutScheduleEntry: boolean;
    getGenres: (id: number) => Array<Genre>;
    searchText: string;
    setSearchText: Dispatch<SetStateAction<string>>;
    toggleFilteredStatus: (status: ApplicationStatus) => void;
    toggleFilteredType: (type: Type) => void;
    toggleOnlyMyOrganizerAssignments: () => void;
    toggleOnlyWithoutScheduleEntry: () => void;
    toggleStatusGroup: (status: ApplicationStatus) => void;
}

const InternWorkspaceContext = createContext<InternWorkspaceContextData | null>(null);

interface Props extends PropsWithChildren {
    allGenres: Array<Genre>;
    applications: Array<SerializableParticipant>;
    currentOrganizerUserId: string | null;
    participantGenres: Array<ParticipantGenre>;
    scheduledParticipantIds: Array<number>;
}

const initialCollapsedStatuses = new Array<ApplicationStatus>('Confirmed', 'Rejected', 'Canceled');

const InternWorkspaceContextProvider = ({
    allGenres,
    applications,
    children,
    currentOrganizerUserId,
    participantGenres,
    scheduledParticipantIds,
}: Props): ReactElement => {
    const [filters, setFilters] = useQueryStates(internFilterParsers, internFilterUrlOptions);
    const [collapsedStatusGroups, setCollapsedStatusGroups] = useState<Array<ApplicationStatus>>(initialCollapsedStatuses);

    const filteredTypes = filters.types;
    const filteredStatuses = filters.statuses;
    const searchText = filters.q;
    const onlyMyOrganizerAssignments = filters.mine;
    const onlyWithoutScheduleEntry = filters.unscheduled;

    const filteredApplications = useMemo<Array<SerializableParticipant>>(() => {
        const filteredByChips = applications.filter(
            (application) =>
                (filteredTypes.length === 0 || filteredTypes.includes(application.type)) &&
                (filteredStatuses.length === 0 || filteredStatuses.includes(application.status)) &&
                (!onlyWithoutScheduleEntry || !scheduledParticipantIds.includes(application.id)) &&
                (!onlyMyOrganizerAssignments ||
                    (currentOrganizerUserId !== null &&
                        application.organizers.some(({ organizerUserId }) => organizerUserId === currentOrganizerUserId))),
        );

        if (isEmptyString(searchText)) {
            return filteredByChips;
        }

        return filteredByChips.filter((application) => matchesParticipantSearch(application, searchText));
    }, [
        applications,
        currentOrganizerUserId,
        filteredStatuses,
        filteredTypes,
        onlyMyOrganizerAssignments,
        onlyWithoutScheduleEntry,
        scheduledParticipantIds,
        searchText,
    ]);

    const getGenres = useCallback(
        (id: number) => {
            const ownParticipantGenreIds = participantGenres.filter((genre) => genre.participantId === id).map((genre) => genre.genreId);

            return allGenres.filter((genre) => ownParticipantGenreIds.includes(genre.id));
        },
        [allGenres, participantGenres],
    );

    const setSearchText = useCallback<Dispatch<SetStateAction<string>>>(
        (value) => {
            void setFilters((current) => ({
                q: typeof value === 'function' ? value(current.q) : value,
            }));
        },
        [setFilters],
    );

    const toggleFilteredType = useCallback(
        (type: Type) => {
            void setFilters((current) => ({ types: xor(current.types, [type]) }));
        },
        [setFilters],
    );

    const toggleFilteredStatus = useCallback(
        (status: ApplicationStatus) => {
            void setFilters((current) => ({ statuses: xor(current.statuses, [status]) }));
        },
        [setFilters],
    );

    const toggleOnlyMyOrganizerAssignments = useCallback(() => {
        void setFilters((current) => ({ mine: !current.mine }));
    }, [setFilters]);

    const toggleOnlyWithoutScheduleEntry = useCallback(() => {
        void setFilters((current) => ({ unscheduled: !current.unscheduled }));
    }, [setFilters]);

    const toggleStatusGroup = useCallback(
        (status: ApplicationStatus) => setCollapsedStatusGroups((statuses) => xor(statuses, [status])),
        [],
    );

    return (
        <InternWorkspaceContext.Provider
            value={{
                allApplications: applications,
                collapsedStatusGroups,
                currentOrganizerUserId,
                filteredApplications,
                filteredStatuses,
                filteredTypes,
                onlyMyOrganizerAssignments,
                onlyWithoutScheduleEntry,
                getGenres,
                searchText,
                setSearchText,
                toggleFilteredStatus,
                toggleFilteredType,
                toggleOnlyMyOrganizerAssignments,
                toggleOnlyWithoutScheduleEntry,
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
