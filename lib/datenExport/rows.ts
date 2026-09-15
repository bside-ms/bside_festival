import { datenExportColumnLabels, visibleDatenExportColumnIds, type DatenExportColumnId } from '@/lib/datenExport/columns';
import type { DatenExportParticipant } from '@/lib/datenExport/participant';
import statusLabels from '@/lib/participants/status/statusLabels';
import typeLabels from '@/lib/participants/typeLabels';

type DatenExportTableRow = {
    cells: Array<string>;
    key: string;
};

export type DatenExportTable = {
    columnIds: Array<DatenExportColumnId>;
    headers: Array<string>;
    rows: Array<DatenExportTableRow>;
};

const formatGage = (feeEuros: number | null): string => (feeEuros === null ? '' : `${feeEuros} €`);

const cellValue = (participant: DatenExportParticipant, columnId: DatenExportColumnId, slot: string | null): string => {
    switch (columnId) {
        case 'contactMail':
            return participant.contactMail.trim();
        case 'contactName':
            return participant.contactName?.trim() ?? '';
        case 'contactPhone':
            return participant.contactPhone?.trim() ?? '';
        case 'gage':
            return formatGage(participant.feeEuros);
        case 'genre':
            return participant.genres.join(', ');
        case 'name':
            return participant.name.trim();
        case 'participantCount':
            return participant.participantCount.toString();
        case 'slot':
            return slot ?? '';
        case 'status':
            return statusLabels[participant.status];
        case 'type':
            return typeLabels[participant.type];
    }
};

const toRow = (
    participant: DatenExportParticipant,
    columnIds: Array<DatenExportColumnId>,
    slot: string | null,
    key: string,
): DatenExportTableRow => ({
    cells: columnIds.map((columnId) => cellValue(participant, columnId, slot)),
    key,
});

export const toDatenExportTable = (
    participants: Array<DatenExportParticipant>,
    selectedColumnIds: Array<DatenExportColumnId>,
): DatenExportTable => {
    const columnIds = visibleDatenExportColumnIds(selectedColumnIds);
    const headers = columnIds.map((columnId) => datenExportColumnLabels[columnId]);
    const includeSlot = columnIds.includes('slot');

    const rows = participants.flatMap((participant) => {
        if (!includeSlot) {
            return [toRow(participant, columnIds, null, String(participant.id))];
        }

        return participant.slots.map((slot, slotIndex) => toRow(participant, columnIds, slot, `${participant.id}:${slotIndex}`));
    });

    return { columnIds, headers, rows };
};
