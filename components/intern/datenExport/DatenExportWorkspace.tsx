'use client';

import { getDatenExportParticipants } from '@/lib/actions/datenExportActions';
import { datenExportColumnHints, datenExportColumnIds, datenExportColumnLabels, type DatenExportColumnId } from '@/lib/datenExport/columns';
import { DATEN_EXPORT_TITLE } from '@/lib/datenExport/copy';
import { buildDatenExportCsv, datenExportFilename } from '@/lib/datenExport/csv';
import { patchDatenExportDraft, readDatenExportDraft } from '@/lib/datenExport/draftStorage';
import type { DatenExportParticipant } from '@/lib/datenExport/participant';
import { toDatenExportTable } from '@/lib/datenExport/rows';
import { getDatenExportMissingSlots } from '@/lib/datenExport/validate';
import { xor } from 'lodash';
import { useRouter } from 'next/navigation';
import type { ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const toErrorMessage = (error: unknown): string => (error instanceof Error ? error.message : 'Unbekannter Fehler');

const ColumnToggle = ({
    columnId,
    isSelected,
    onToggle,
}: {
    columnId: DatenExportColumnId;
    isSelected: boolean;
    onToggle: (columnId: DatenExportColumnId) => void;
}): ReactElement => {
    const hint = datenExportColumnHints[columnId];
    const handleChange = useCallback(() => onToggle(columnId), [columnId, onToggle]);

    return (
        <label className="flex cursor-pointer items-start gap-2">
            <input type="checkbox" checked={isSelected} className="mt-0.5 size-4 accent-black" onChange={handleChange} />
            <span>
                <span className="text-sm font-bold">{datenExportColumnLabels[columnId]}</span>
                {hint === undefined ? null : <span className="mt-0.5 block text-xs font-normal text-black/60">{hint}</span>}
            </span>
        </label>
    );
};

const DatenExportWorkspace = (): ReactElement => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [participants, setParticipants] = useState<Array<DatenExportParticipant>>([]);
    const [selectedColumnIds, setSelectedColumnIds] = useState<Array<DatenExportColumnId>>([]);

    useEffect(() => {
        const draft = readDatenExportDraft();

        if (draft.participantIds.length === 0) {
            router.replace('/intern');
            return;
        }

        setSelectedColumnIds(draft.columns);

        void getDatenExportParticipants(draft.participantIds)
            .then((loaded) => {
                if (loaded.length === 0) {
                    setLoadError('Keine der ausgewählten Programmbeiträge wurden gefunden.');
                    setIsLoading(false);
                    return;
                }

                setParticipants(loaded);
                setIsLoading(false);
            })
            .catch((error: unknown) => {
                setLoadError(toErrorMessage(error));
                setIsLoading(false);
            });
    }, [router]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        patchDatenExportDraft({ columns: selectedColumnIds });
    }, [isLoading, selectedColumnIds]);

    const missingSlots = useMemo(() => getDatenExportMissingSlots(participants, selectedColumnIds), [participants, selectedColumnIds]);
    const table = useMemo(() => toDatenExportTable(participants, selectedColumnIds), [participants, selectedColumnIds]);
    const canDownload = selectedColumnIds.length > 0 && missingSlots.length === 0 && table.rows.length > 0;

    const handleToggleColumn = useCallback((columnId: DatenExportColumnId) => {
        setSelectedColumnIds((current) => xor(current, [columnId]));
    }, []);

    const handleBackToSelection = useCallback(() => {
        const listSearch = readDatenExportDraft().listSearch;
        router.push(listSearch.length > 0 ? `/intern${listSearch}` : '/intern?datenExport=true');
    }, [router]);

    const handleDownload = useCallback(() => {
        if (!canDownload) {
            return;
        }

        const csv = buildDatenExportCsv(
            table.columnIds,
            table.rows.map((row) => row.cells),
        );
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = datenExportFilename();
        anchor.click();
        URL.revokeObjectURL(url);
    }, [canDownload, table.columnIds, table.rows]);

    if (isLoading) {
        return <div className="text-sm text-black/60">Beiträge werden geladen…</div>;
    }

    const visibleMissingSlots = missingSlots.slice(0, 20);
    const extraMissingSlotCount = missingSlots.length - visibleMissingSlots.length;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h1 className="font-display text-4xl leading-none uppercase md:text-5xl">{DATEN_EXPORT_TITLE}</h1>
                    <div className="mt-1 text-sm text-black/60">
                        {participants.length} Beiträge
                        {table.rows.length !== participants.length ? ` · ${table.rows.length} Zeilen` : ''}
                    </div>
                </div>
                <button
                    type="button"
                    className="cursor-pointer rounded border border-black bg-white px-3 py-2 text-xs font-bold"
                    onClick={handleBackToSelection}
                >
                    Zurück zur Auswahl
                </button>
            </div>

            {loadError !== null ? (
                <div className="rounded-md border border-red-700 bg-red-50 p-3 text-sm text-red-900">{loadError}</div>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]">
                <div className="space-y-3 rounded-md border border-black bg-white p-4 shadow-lg">
                    <div className="text-xs font-bold tracking-wide uppercase">Spalten</div>
                    <ul className="space-y-2">
                        {datenExportColumnIds.map((columnId) => (
                            <li key={columnId}>
                                <ColumnToggle
                                    columnId={columnId}
                                    isSelected={selectedColumnIds.includes(columnId)}
                                    onToggle={handleToggleColumn}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-3 rounded-md border border-black bg-white p-4 shadow-lg">
                    <div className="text-xs font-bold tracking-wide uppercase">Vorschau</div>
                    {selectedColumnIds.length === 0 ? (
                        <p className="text-sm text-black/60">Mindestens eine Spalte wählen.</p>
                    ) : table.rows.length === 0 ? (
                        <p className="text-sm text-black/60">Keine Zeilen.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr>
                                        {table.headers.map((header) => (
                                            <th
                                                key={header}
                                                className="border-b border-black/15 px-2 py-1.5 text-xs font-bold tracking-wide text-black/70 uppercase"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.rows.map((row) => (
                                        <tr key={row.key} className="border-t border-black/10">
                                            {table.headers.map((header, cellIndex) => (
                                                <td key={`${row.key}:${header}`} className="px-2 py-1.5 align-top">
                                                    {row.cells[cellIndex]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {missingSlots.length > 0 ? (
                <div className="rounded-md border border-red-700 bg-red-50 p-3 text-sm text-red-900">
                    <div className="font-bold">Export nicht möglich, diese Beiträge haben keinen Slot:</div>
                    <ul className="mt-2 list-disc pl-5">
                        {visibleMissingSlots.map((missingSlot) => (
                            <li key={missingSlot.id}>{missingSlot.name}</li>
                        ))}
                    </ul>
                    {extraMissingSlotCount > 0 ? <p className="mt-2">{extraMissingSlotCount} weitere…</p> : null}
                </div>
            ) : null}

            <div className="flex justify-end">
                <button
                    type="button"
                    disabled={!canDownload}
                    className="cursor-pointer rounded border border-black bg-black px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleDownload}
                >
                    CSV herunterladen
                </button>
            </div>
        </div>
    );
};

export default DatenExportWorkspace;
