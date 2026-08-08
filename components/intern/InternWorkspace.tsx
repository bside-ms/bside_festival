'use client';

import ContributionTable from '@/components/intern/ContributionTable';
import { statusOrder, useInternWorkspaceContext } from '@/components/intern/InternWorkspaceContext';
import cn from '@/lib/common/helper/cn';
import statusColors from '@/lib/participants/status/statusColors';
import statusLabels from '@/lib/participants/status/statusLabels';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import type { ApplicationStatus, Type } from '@prisma/client';
import type { ChangeEvent, CSSProperties, ReactElement, ReactNode } from 'react';
import { useCallback } from 'react';

const allTypes = Object.keys(typeLabels) as Array<Type>;

const baseChipClassName = (isActive: boolean, disabled = false): string =>
    cn(
        'cursor-pointer rounded border px-2 py-0.5 text-[11px] leading-tight font-bold transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
        isActive ? 'ring-1 ring-black' : 'opacity-70 hover:opacity-100',
    );

const FilterToggle = <T extends string>({
    className,
    isActive,
    label,
    onToggle,
    style,
    value,
}: {
    className?: string;
    isActive: boolean;
    label: string;
    onToggle: (value: T) => void;
    style?: CSSProperties;
    value: T;
}): ReactElement => {
    const handleClick = useCallback(() => onToggle(value), [onToggle, value]);

    return (
        <button
            type="button"
            className={cn(baseChipClassName(isActive), className, isActive ? 'border-black' : 'border-black/25 hover:border-black')}
            style={style}
            onClick={handleClick}
        >
            {label}
        </button>
    );
};

const FilterRow = ({ label, children }: { children: ReactNode; label: string }): ReactElement => (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="w-14 shrink-0 text-[11px] font-bold tracking-wide text-black/50 uppercase">{label}</span>
        <div className="flex min-w-0 flex-1 flex-wrap gap-1">{children}</div>
    </div>
);

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
        <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h1 className="font-display text-4xl leading-none uppercase md:text-5xl">Programmbeiträge</h1>
                    <div className="mt-1 text-sm text-black/60">{applicationAmount} Beiträge</div>
                </div>
            </div>

            <div className="space-y-2 rounded-md border border-black bg-white/80 p-3 shadow-lg backdrop-blur-2xl">
                <div className="flex flex-wrap items-center gap-1.5">
                    <input
                        value={searchText}
                        className="w-44 max-w-full rounded border border-black bg-white px-2 py-0.5 text-[11px] outline-0"
                        placeholder="Suche…"
                        aria-label="Suche"
                        onChange={handleSearchTextChange}
                    />
                    <button
                        type="button"
                        disabled={currentOrganizerUserId === null}
                        className={cn(
                            baseChipClassName(onlyMyOrganizerAssignments, currentOrganizerUserId === null),
                            'bg-violet-100',
                            onlyMyOrganizerAssignments ? 'border-black' : 'border-black/25 hover:border-black',
                        )}
                        onClick={handleOnlyMyOrganizerAssignmentsToggle}
                    >
                        Mir zugewiesen
                    </button>
                    <button
                        type="button"
                        className={cn(
                            baseChipClassName(onlyWithoutScheduleEntry),
                            'bg-amber-100',
                            onlyWithoutScheduleEntry ? 'border-black' : 'border-black/25 hover:border-black',
                        )}
                        onClick={handleOnlyWithoutScheduleEntryToggle}
                    >
                        Nicht im Slotplan
                    </button>
                </div>

                <FilterRow label="Typ">
                    {allTypes.map((type) => (
                        <FilterToggle
                            key={type}
                            isActive={filteredTypes.includes(type)}
                            label={typeLabels[type]}
                            style={{ backgroundColor: typeColors[type] }}
                            onToggle={toggleFilteredType}
                            value={type}
                        />
                    ))}
                </FilterRow>

                <FilterRow label="Status">
                    {statusOrder.map((status) => {
                        const colors = statusColors[status];

                        return (
                            <FilterToggle<ApplicationStatus>
                                key={status}
                                className={cn(colors.badge, colors.border, colors.text)}
                                isActive={filteredStatuses.includes(status)}
                                label={statusLabels[status]}
                                onToggle={toggleFilteredStatus}
                                value={status}
                            />
                        );
                    })}
                </FilterRow>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="rounded-md border border-black bg-white/80 p-5 font-bold shadow-lg">
                    Keine passenden Programmbeiträge gefunden.
                </div>
            ) : (
                <ContributionTable />
            )}
        </div>
    );
};

export default InternWorkspace;
