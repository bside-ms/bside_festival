import type { DatenExportColumnId } from '@/lib/datenExport/columns';
import type { DatenExportParticipant } from '@/lib/datenExport/participant';

export type DatenExportMissingSlot = {
    id: number;
    name: string;
};

export const getDatenExportMissingSlots = (
    participants: Array<DatenExportParticipant>,
    selectedColumnIds: Array<DatenExportColumnId>,
): Array<DatenExportMissingSlot> => {
    if (!selectedColumnIds.includes('slot')) {
        return [];
    }

    return participants
        .filter((participant) => participant.slots.length === 0)
        .map((participant) => ({
            id: participant.id,
            name: participant.name.trim().length > 0 ? participant.name.trim() : `#${participant.id}`,
        }));
};
