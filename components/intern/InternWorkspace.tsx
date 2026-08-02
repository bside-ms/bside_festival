'use client';

import { statusOrder, useInternWorkspaceContext } from '@/components/intern/InternWorkspaceContext';
import StatusGroup from '@/components/intern/StatusGroup';
import cn from '@/lib/common/helper/cn';
import statusLabels from '@/lib/participants/status/statusLabels';
import typeLabels from '@/lib/participants/typeLabels';
import type { ApplicationStatus, Type } from '@prisma/client';
import { groupBy } from 'lodash';
import type { ChangeEvent, ReactElement } from 'react';
import { useCallback, useMemo } from 'react';

const allTypes = Object.keys(typeLabels) as Array<Type>;

const FilterToggle = <T extends string>({
    isActive,
    label,
    onToggle,
    value,
}: {
    isActive: boolean;
    label: string;
    onToggle: (value: T) => void;
    value: T;
}): ReactElement => {
    const handleClick = useCallback(() => onToggle(value), [onToggle, value]);

    return (
        <button
            type="button"
            className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-bold transition-colors',
                isActive ? 'border-black bg-black text-white' : 'border-black/20 bg-white text-black hover:border-black',
            )}
            onClick={handleClick}
        >
            {label}
        </button>
    );
};

const InternWorkspace = (): ReactElement => {
    const {
        allApplications,
        filteredApplications,
        currentOrganizerUserId,
        filteredStatuses,
        filteredTypes,
        onlyMyOrganizerAssignments,
        onlyWithoutScheduleEntry,
        searchText,
        setSearchText,
        toggleFilteredStatus,
        toggleFilteredType,
        toggleOnlyMyOrganizerAssignments,
        toggleOnlyWithoutScheduleEntry,
    } = useInternWorkspaceContext();

    const groupedApplications = useMemo(() => groupBy(filteredApplications, ({ status }) => status), [filteredApplications]);
    const applicationAmount =
        filteredApplications.length === allApplications.length
            ? allApplications.length.toString()
            : `${filteredApplications.length} von ${allApplications.length}`;

    const handleSearchTextChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value),
        [setSearchText],
    );
    const handleOnlyMyOrganizerAssignmentsToggle = useCallback(
        () => toggleOnlyMyOrganizerAssignments(),
        [toggleOnlyMyOrganizerAssignments],
    );
    const handleOnlyWithoutScheduleEntryToggle = useCallback(() => toggleOnlyWithoutScheduleEntry(), [toggleOnlyWithoutScheduleEntry]);

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="font-display text-5xl leading-none uppercase">Programmbeiträge</h1>
                    <div className="mt-1 text-sm text-black/60">{applicationAmount} Beiträge</div>
                </div>
            </div>

            <div className="rounded-md border border-black bg-white/80 p-4 shadow-lg backdrop-blur-2xl">
                <label className="block">
                    <span className="text-sm font-bold">Suche</span>
                    <input
                        value={searchText}
                        className="mt-1 w-full rounded border border-black bg-white p-3 outline-0"
                        placeholder="Name, Beschreibung, Kontakt"
                        onChange={handleSearchTextChange}
                    />
                </label>

                <div className="mt-4">
                    <div className="mb-2 text-sm font-bold">Planung</div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            disabled={currentOrganizerUserId === null}
                            className={cn(
                                'cursor-pointer rounded-full border px-3 py-1 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                                onlyMyOrganizerAssignments
                                    ? 'border-black bg-black text-white'
                                    : 'border-black/20 bg-white text-black hover:border-black',
                            )}
                            onClick={handleOnlyMyOrganizerAssignmentsToggle}
                        >
                            Mir zugewiesen
                        </button>
                        <button
                            type="button"
                            className={cn(
                                'cursor-pointer rounded-full border px-3 py-1 text-xs font-bold transition-colors',
                                onlyWithoutScheduleEntry
                                    ? 'border-black bg-black text-white'
                                    : 'border-black/20 bg-white text-black hover:border-black',
                            )}
                            onClick={handleOnlyWithoutScheduleEntryToggle}
                        >
                            Nicht im Slotplan
                        </button>
                    </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                        <div className="mb-2 text-sm font-bold">Typ</div>
                        <div className="flex flex-wrap gap-2">
                            {allTypes.map((type) => (
                                <FilterToggle
                                    key={type}
                                    isActive={filteredTypes.includes(type)}
                                    label={typeLabels[type]}
                                    onToggle={toggleFilteredType}
                                    value={type}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 text-sm font-bold">Status</div>
                        <div className="flex flex-wrap gap-2">
                            {statusOrder.map((status) => (
                                <FilterToggle<ApplicationStatus>
                                    key={status}
                                    isActive={filteredStatuses.includes(status)}
                                    label={statusLabels[status]}
                                    onToggle={toggleFilteredStatus}
                                    value={status}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="rounded-md border border-black bg-white/80 p-5 font-bold shadow-lg">
                    Keine passenden Programmbeiträge gefunden.
                </div>
            ) : (
                statusOrder
                    .filter((status) => {
                        const applications = groupedApplications[status];
                        return applications !== undefined && applications.length > 0;
                    })
                    .map((status) => {
                        const applications = groupedApplications[status]!;
                        return <StatusGroup key={status} applications={applications} status={status} />;
                    })
            )}
        </div>
    );
};

export default InternWorkspace;
