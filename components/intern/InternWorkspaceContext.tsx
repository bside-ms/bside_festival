'use client';

import isEmptyString from '@/lib/common/helper/isEmptyString';
import {
    internFilterParsers,
    internFilterUrlOptions,
    type InternListSortColumn,
    type InternListSortDirection,
} from '@/lib/intern/internFilterSearchParams';
import matchesParticipantSearch from '@/lib/participants/matchesParticipantSearch';
import statusOrder from '@/lib/participants/status/statusOrder';
import type { SerializableListParticipant } from '@/typings/SerializableListParticipant';
import type { ApplicationStatus, Type } from '@prisma/client';
import { xor } from 'lodash';
import { useQueryStates } from 'nuqs';
import type { Dispatch, PropsWithChildren, ReactElement, SetStateAction } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

interface InternWorkspaceContextData {
    allApplications: Array<SerializableListParticipant>;
    filteredApplications: Array<SerializableListParticipant>;
    filteredStatuses: Array<ApplicationStatus>;
    filteredTypes: Array<Type>;
    currentOrganizerUserId: string | null;
    onlyMyOrganizerAssignments: boolean;
    onlyWithoutScheduleEntry: boolean;
    searchText: string;
    setSearchText: Dispatch<SetStateAction<string>>;
    sortColumn: InternListSortColumn;
    sortDirection: InternListSortDirection;
    toggleFilteredStatus: (status: ApplicationStatus) => void;
    toggleFilteredType: (type: Type) => void;
    toggleOnlyMyOrganizerAssignments: () => void;
    toggleOnlyWithoutScheduleEntry: () => void;
    toggleSort: (column: InternListSortColumn) => void;
}

const InternWorkspaceContext = createContext<InternWorkspaceContextData | null>(null);

interface Props extends PropsWithChildren {
    applications: Array<SerializableListParticipant>;
    currentOrganizerUserId: string | null;
    scheduledParticipantIds: Array<number>;
}

const compareNullableString = (left: string | null, right: string | null, direction: InternListSortDirection): number => {
    if (left === null && right === null) {
        return 0;
    }

    if (left === null) {
        return 1;
    }

    if (right === null) {
        return -1;
    }

    const compared = left.localeCompare(right, 'de-DE', { sensitivity: 'base' });

    return direction === 'asc' ? compared : -compared;
};

const compareNullableNumber = (left: number | null, right: number | null, direction: InternListSortDirection): number => {
    if (left === null && right === null) {
        return 0;
    }

    if (left === null) {
        return 1;
    }

    if (right === null) {
        return -1;
    }

    return direction === 'asc' ? left - right : right - left;
};

const sortApplications = (
    applications: Array<SerializableListParticipant>,
    sortColumn: InternListSortColumn,
    sortDirection: InternListSortDirection,
): Array<SerializableListParticipant> =>
    [...applications].sort((left, right) => {
        switch (sortColumn) {
            case 'name':
                return compareNullableString(left.name, right.name, sortDirection);
            case 'status': {
                const leftIndex = statusOrder.indexOf(left.status);
                const rightIndex = statusOrder.indexOf(right.status);
                const compared = leftIndex - rightIndex;

                return sortDirection === 'asc' ? compared : -compared;
            }
            case 'location':
                return compareNullableString(
                    left.earliestSlot?.locationName ?? null,
                    right.earliestSlot?.locationName ?? null,
                    sortDirection,
                );
            case 'time':
                return compareNullableString(left.earliestSlot?.sortAt ?? null, right.earliestSlot?.sortAt ?? null, sortDirection);
            case 'fee':
                return compareNullableNumber(left.feeEuros, right.feeEuros, sortDirection);
            default:
                return 0;
        }
    });

const InternWorkspaceContextProvider = ({
    applications,
    children,
    currentOrganizerUserId,
    scheduledParticipantIds,
}: Props): ReactElement => {
    const [filters, setFilters] = useQueryStates(internFilterParsers, internFilterUrlOptions);

    const filteredTypes = filters.types;
    const filteredStatuses = filters.statuses;
    const searchText = filters.q;
    const onlyMyOrganizerAssignments = filters.mine;
    const onlyWithoutScheduleEntry = filters.unscheduled;
    const sortColumn = filters.sort;
    const sortDirection = filters.sortDir;

    const filteredApplications = useMemo<Array<SerializableListParticipant>>(() => {
        const filteredByChips = applications.filter(
            (application) =>
                (filteredTypes.length === 0 || filteredTypes.includes(application.type)) &&
                (filteredStatuses.length === 0 || filteredStatuses.includes(application.status)) &&
                (!onlyWithoutScheduleEntry || !scheduledParticipantIds.includes(application.id)) &&
                (!onlyMyOrganizerAssignments ||
                    (currentOrganizerUserId !== null &&
                        application.organizers.some(({ organizerUserId }) => organizerUserId === currentOrganizerUserId))),
        );

        const searched = isEmptyString(searchText)
            ? filteredByChips
            : filteredByChips.filter((application) => matchesParticipantSearch(application, searchText));

        return sortApplications(searched, sortColumn, sortDirection);
    }, [
        applications,
        currentOrganizerUserId,
        filteredStatuses,
        filteredTypes,
        onlyMyOrganizerAssignments,
        onlyWithoutScheduleEntry,
        scheduledParticipantIds,
        searchText,
        sortColumn,
        sortDirection,
    ]);

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

    const toggleSort = useCallback(
        (column: InternListSortColumn) => {
            void setFilters((current) => {
                if (current.sort === column) {
                    return { sortDir: current.sortDir === 'asc' ? 'desc' : 'asc' };
                }

                return { sort: column, sortDir: 'asc' };
            });
        },
        [setFilters],
    );

    return (
        <InternWorkspaceContext.Provider
            value={{
                allApplications: applications,
                currentOrganizerUserId,
                filteredApplications,
                filteredStatuses,
                filteredTypes,
                onlyMyOrganizerAssignments,
                onlyWithoutScheduleEntry,
                searchText,
                setSearchText,
                sortColumn,
                sortDirection,
                toggleFilteredStatus,
                toggleFilteredType,
                toggleOnlyMyOrganizerAssignments,
                toggleOnlyWithoutScheduleEntry,
                toggleSort,
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
