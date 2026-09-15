import { defaultDatenExportColumnIds, isDatenExportColumnId, type DatenExportColumnId } from '@/lib/datenExport/columns';

export type DatenExportDraft = {
    columns: Array<DatenExportColumnId>;
    listSearch: string;
    participantIds: Array<number>;
};

const STORAGE_KEY = 'intern-daten-export-draft';

const parseColumnIds = (value: unknown): Array<DatenExportColumnId> => {
    if (!Array.isArray(value)) {
        return [...defaultDatenExportColumnIds];
    }

    const columnIds = value.filter((item): item is string => typeof item === 'string').filter(isDatenExportColumnId);

    return columnIds.length > 0 ? columnIds : [...defaultDatenExportColumnIds];
};

const emptyDraft = (): DatenExportDraft => ({
    columns: [...defaultDatenExportColumnIds],
    listSearch: '',
    participantIds: [],
});

export const readDatenExportDraft = (): DatenExportDraft => {
    if (typeof window === 'undefined') {
        return emptyDraft();
    }

    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (raw === null) {
        return emptyDraft();
    }

    try {
        const parsed = JSON.parse(raw) as Partial<DatenExportDraft>;
        const participantIds = Array.isArray(parsed.participantIds)
            ? parsed.participantIds.filter((id): id is number => Number.isInteger(id) && id > 0)
            : [];

        return {
            columns: parseColumnIds(parsed.columns),
            listSearch: typeof parsed.listSearch === 'string' ? parsed.listSearch : '',
            participantIds,
        };
    } catch {
        return emptyDraft();
    }
};

const writeDatenExportDraft = (draft: DatenExportDraft): void => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

export const patchDatenExportDraft = (patch: Partial<DatenExportDraft>): DatenExportDraft => {
    const next = { ...readDatenExportDraft(), ...patch };
    writeDatenExportDraft(next);

    return next;
};

export const clearDatenExportDraft = (): void => {
    sessionStorage.removeItem(STORAGE_KEY);
};
