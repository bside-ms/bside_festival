export const datenExportColumnIds = [
    'name',
    'type',
    'status',
    'slot',
    'genre',
    'contactName',
    'contactMail',
    'contactPhone',
    'gage',
    'participantCount',
] as const;

export type DatenExportColumnId = (typeof datenExportColumnIds)[number];

export const defaultDatenExportColumnIds: Array<DatenExportColumnId> = ['name', 'type', 'status', 'gage'];

export const datenExportColumnLabels: Record<DatenExportColumnId, string> = {
    contactMail: 'E-Mail',
    contactName: 'Ansprechperson',
    contactPhone: 'Telefon',
    gage: 'Gage',
    genre: 'Genre',
    name: 'Name',
    participantCount: 'Personenzahl',
    slot: 'Slot',
    status: 'Status',
    type: 'Typ',
};

export const datenExportColumnHints: Partial<Record<DatenExportColumnId, string>> = {
    slot: 'Kann mehr als eine Zeile pro Programmbeitrag erzeugen. Jeder ausgewählte Beitrag braucht mindestens einen Slot.',
};

export const isDatenExportColumnId = (value: string): value is DatenExportColumnId =>
    datenExportColumnIds.some((columnId) => columnId === value);

export const visibleDatenExportColumnIds = (selectedColumnIds: Array<string>): Array<DatenExportColumnId> =>
    datenExportColumnIds.filter((columnId) => selectedColumnIds.includes(columnId));
