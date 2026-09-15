'use client';

import ContributionTable from '@/components/intern/ContributionTable';
import { statusOrder, useInternWorkspaceContext } from '@/components/intern/InternWorkspaceContext';
import cn from '@/lib/common/helper/cn';
import { DATEN_EXPORT_PATH, DATEN_EXPORT_SELECTION_HINT, DATEN_EXPORT_TITLE } from '@/lib/datenExport/copy';
import { patchDatenExportDraft } from '@/lib/datenExport/draftStorage';
import { MAIL_MERGE_COMPOSE_PATH, MAIL_MERGE_SELECTION_HINT, MAIL_MERGE_TITLE } from '@/lib/mailMerge/copy';
import { patchMailMergeDraft } from '@/lib/mailMerge/draftStorage';
import statusColors from '@/lib/participants/status/statusColors';
import statusLabels from '@/lib/participants/status/statusLabels';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import { faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ApplicationStatus, Type } from '@prisma/client';
import { useRouter } from 'next/navigation';
import type { ChangeEvent, CSSProperties, ReactElement, ReactNode } from 'react';
import { useCallback } from 'react';

const allTypes = Object.keys(typeLabels) as Array<Type>;

const baseChipClassName = (isActive: boolean, disabled = false): string =>
    cn(
        'cursor-pointer rounded border px-2 py-0.5 text-[11px] leading-tight font-bold transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
        isActive ? 'ring-1 ring-black' : 'opacity-70 hover:opacity-100',
    );

const FilterToggle = <T extends number | string>({
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
        <span className="w-16 shrink-0 text-[11px] font-bold tracking-wide text-black/50 uppercase">{label}</span>
        <div className="flex min-w-0 flex-1 flex-wrap gap-1">{children}</div>
    </div>
);

const InternWorkspace = (): ReactElement => {
    const {
        allApplications,
        areAllFilteredSelected,
        currentOrganizerUserId,
        filteredApplications,
        filteredAreaIds,
        filteredSelectedCount,
        filteredStatuses,
        filteredTypes,
        hasUnassignedLocations,
        isDatenExportMode,
        isInDataPrivacyGroup,
        isSelectingParticipants,
        onlyMyOrganizerAssignments,
        onlyUnassignedArea,
        onlyWithoutScheduleEntry,
        programLocationAreas,
        orderedSelectedParticipantIds,
        searchText,
        selectedCount,
        setSearchText,
        toggleFilteredArea,
        toggleFilteredStatus,
        toggleFilteredType,
        toggleOnlyMyOrganizerAssignments,
        toggleOnlyUnassignedArea,
        toggleOnlyWithoutScheduleEntry,
        cancelDatenExport,
        cancelMailMerge,
        selectAllFilteredParticipants,
        startDatenExport,
        startMailMerge,
        unselectFilteredParticipants,
    } = useInternWorkspaceContext();
    const router = useRouter();

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
    const handleOnlyUnassignedAreaToggle = useCallback(() => toggleOnlyUnassignedArea(), [toggleOnlyUnassignedArea]);
    const handleContinueMailMerge = useCallback(() => {
        patchMailMergeDraft({ listSearch: window.location.search });
        router.push(MAIL_MERGE_COMPOSE_PATH);
    }, [router]);
    const handleContinueDatenExport = useCallback(() => {
        patchDatenExportDraft({ listSearch: window.location.search, participantIds: orderedSelectedParticipantIds });
        router.push(DATEN_EXPORT_PATH);
    }, [orderedSelectedParticipantIds, router]);
    const handleToggleSelectAllFiltered = useCallback(() => {
        if (areAllFilteredSelected) {
            unselectFilteredParticipants();
            return;
        }

        selectAllFilteredParticipants();
    }, [areAllFilteredSelected, selectAllFilteredParticipants, unselectFilteredParticipants]);

    const hiddenSelectedCount = selectedCount - filteredSelectedCount;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h1 className="font-display text-4xl leading-none uppercase md:text-5xl">Programmbeiträge</h1>
                    <div className="mt-1 text-sm text-black/60">{applicationAmount} Beiträge</div>
                </div>
                {isInDataPrivacyGroup && !isSelectingParticipants ? (
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="inline-flex cursor-pointer items-center gap-2 rounded border border-black bg-black px-3 py-2 text-xs font-bold text-white"
                            onClick={startMailMerge}
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="h-3.5 w-3.5" />
                            {MAIL_MERGE_TITLE}
                        </button>
                        <button
                            type="button"
                            className="inline-flex cursor-pointer items-center gap-2 rounded border border-black bg-black px-3 py-2 text-xs font-bold text-white"
                            onClick={startDatenExport}
                        >
                            <FontAwesomeIcon icon={faDownload} className="h-3.5 w-3.5" />
                            {DATEN_EXPORT_TITLE}
                        </button>
                    </div>
                ) : null}
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

                {programLocationAreas.length > 0 || hasUnassignedLocations ? (
                    <FilterRow label="Bereich">
                        {programLocationAreas.map((area) => (
                            <FilterToggle
                                key={area.id}
                                isActive={filteredAreaIds.includes(area.id)}
                                label={area.name}
                                onToggle={toggleFilteredArea}
                                value={area.id}
                            />
                        ))}
                        {hasUnassignedLocations ? (
                            <button
                                type="button"
                                className={cn(
                                    baseChipClassName(onlyUnassignedArea),
                                    onlyUnassignedArea ? 'border-black' : 'border-black/25 hover:border-black',
                                )}
                                onClick={handleOnlyUnassignedAreaToggle}
                            >
                                Ohne Bereich
                            </button>
                        ) : null}
                    </FilterRow>
                ) : null}
            </div>

            {isSelectingParticipants ? (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-black bg-white p-3 shadow-lg">
                    <div className="text-sm">
                        <div className="font-bold">{isDatenExportMode ? DATEN_EXPORT_TITLE : MAIL_MERGE_TITLE}</div>
                        <div className="text-black/60">
                            {selectedCount} ausgewählt
                            {hiddenSelectedCount > 0 ? ` · ${hiddenSelectedCount} gerade ausgeblendet` : ''}
                            {` · ${isDatenExportMode ? DATEN_EXPORT_SELECTION_HINT : MAIL_MERGE_SELECTION_HINT}`}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="cursor-pointer rounded border border-black bg-white px-3 py-2 text-xs font-bold"
                            onClick={handleToggleSelectAllFiltered}
                        >
                            {areAllFilteredSelected ? 'Gefilterte abwählen' : 'Alle gefilterten auswählen'}
                        </button>
                        <button
                            type="button"
                            className="cursor-pointer rounded border border-black bg-white px-3 py-2 text-xs font-bold"
                            onClick={isDatenExportMode ? cancelDatenExport : cancelMailMerge}
                        >
                            Abbrechen
                        </button>
                        <button
                            type="button"
                            disabled={selectedCount === 0}
                            className="cursor-pointer rounded border border-black bg-black px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={isDatenExportMode ? handleContinueDatenExport : handleContinueMailMerge}
                        >
                            {isDatenExportMode ? 'Weiter zum Export' : 'Weiter zum Text'}
                        </button>
                    </div>
                </div>
            ) : null}

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
